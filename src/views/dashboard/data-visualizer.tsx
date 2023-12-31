import Button from "weaviate-gui/components/buttons/button";
import React, { useEffect, useState } from "react";
import { toBase64FromBlob } from "weaviate-ts-client";
import { client } from "@/weaviate/client";

const DataVisualizer = () => {
  const [classes, setClasses] = useState([]);
  const [classNameInput, setClassNameInput] = useState("");
  const [connectedToWeaviate, setConnectedToWeaviate] = useState(false);
  const [weaviateHost, setWeaviateHost] = useState("http:localhost:8080");
  const [classObjects, setClassesObjects] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageResults, setImageResults] = useState([]);

  useEffect(() => {
    onGetSchema();
  }, []);

  const onGetSchema = async () => {
    try {
      const schema = await fetch("/api/weaviate/getSchema");
      const schemaJson = await schema.json();
      console.log({ schemaJson });
      setClasses(schemaJson.classes);
      setConnectedToWeaviate(true);
    } catch (error) {
      console.log({ error });
    }
  };

  const onAddWeaviateClass = (class_name: string) => async () => {
    const requestBody = {
      class_name: class_name,
    };
    try {
      await fetch("/api/weaviate/addClass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(requestBody), // Convert the object to a JSON string
      });
    } catch (error) {
      console.log("something went wrong!");
      console.log({ error });
    }

    console.log("all good");
    onGetSchema();
  };

  const onGetObjectsInClass = async (class_name: string) => {
    console.log("get objects in class");
    const requestBody = {
      class_name: class_name,
    };
    const class_objects = await fetch("/api/weaviate/getObjectsInClass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log({ class_objects });

    const classObjectsJson = await class_objects.json();
    const classObjectsArray = classObjectsJson.data.Get[class_name];

    setClassesObjects(classObjectsArray);
  };

  const onGetObjectsInClassBatch = async (class_name: string) => {
    const requestBody = {
      class_name: class_name,
    };
    const class_objects = await fetch("/api/weaviate/getObjectsInClassBatch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const classObjectsJson = await class_objects.json();
    const classObjectsArray = classObjectsJson.data.Get[class_name];

    console.log({ classObjectsArray });
    // setClassesObjects(classObjectsArray);
  };

  const onSearchClass = async (class_name: string) => {
    const requestBody = {
      class_name: class_name,
    };
    const class_objects = await fetch("/api/weaviate/searchClass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const classObjectsJson = await class_objects.json();
    const classObjectsArray = classObjectsJson.data.Get[class_name];

    console.log({ classObjectsArray });
    // setClassesObjects(classObjectsArray);
  };

  const onFileUpload = async (event: any) => {
    const file = event.target.files[0];
    const base64: any = await toBase64FromBlob(file);
    setImagePreview(base64);

    let searchResults = await client.graphql
      .get()
      .withClassName("ScryfallCard")
      .withNearImage({
        image: base64,
        distance: 0.3,
      })
      .withLimit(5)
      .withFields("name image")
      .do();

    setImageResults(searchResults.data.Get["ScryfallCard"]);
    console.log({ searchResults });
  };

  return (
    <main className="flex min-h-screen flex-col p-8 text-center">
      <div className="h-full w-full">
        <div className="w-full">
          <h1 className="text-bold font-bold">My Weaviate Database</h1>

          <div className="my-8 flex justify-center gap-x-6">
            <h3>
              Host: <input />
            </h3>
            <h3>
              API Key: <input />
            </h3>
          </div>
          <div className="flex justify-center ">
            <div className="rounded-lg bg-green-500 p-4">
              {connectedToWeaviate
                ? " Connected to Weaviate"
                : "Click here to connect your weaviate module"}
            </div>
          </div>

          {classes?.length > 0 && (
            <div className="flex flex-col items-center">
              <div>Number of Classes: {classes?.length}</div>
              <div>
                <h2>My Classes</h2>
                <ul>
                  {classes.map((c: any) => (
                    <div className="flex justify-between gap-x-2" key={c.class}>
                      <li>Class Name: {c.class}</li>
                      <Button
                        variant="primary"
                        onClick={() => onGetObjectsInClass(c.class)}
                      >
                        Get Class Objects
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => onGetObjectsInClassBatch(c.class)}
                      >
                        Get Class Objects Batch
                      </Button>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-x-2 overflow-x-auto">
          {classObjects.length
            ? classObjects.map((obj: any) => {
                return (
                  <div className="flex flex-col " key={obj.name}>
                    <div className="h-24 font-bold">{obj.name}</div>
                    <img
                      src={`data:image/png;base64,${obj.image}`}
                      alt={obj.name}
                      className="h-auto w-40"
                    />
                  </div>
                );
              })
            : null}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center px-24">
          <input
            type="file"
            accept="image/*"
            onChange={onFileUpload}
            className="mt-4"
          />

          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Selected Image"
                className="h-auto w-40"
              />
            </div>
          )}

          {imageResults.length > 0 && (
            <div className="mt-4">
              <h2>Search Results</h2>
              <div className="overflow-x-aut2 flex gap-x-1">
                {imageResults.map((result: any) => (
                  <div>
                    <li key={result.name}>{result.name}</li>
                    <img
                      src={`data:image/png;base64,${result.image}`}
                      alt={result.name}
                      className="h-auto w-40"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            variant="primary"
            onClick={() => onGetObjectsInClassBatch("ScryfallCard")}
            className="mt-4"
          >
            Search Class for Object
          </Button>
        </div>
        <div className="mt-24 flex flex-col gap-2">
          <div>
            <Button variant="primary" onClick={() => onGetSchema()}>
              get schema
            </Button>
            <div>
              <Button
                variant="primary"
                onClick={onAddWeaviateClass(classNameInput)}
              >
                Add weaviate class
              </Button>
            </div>
            <input
              placeholder="Ex: Dogs"
              onChange={(e) => setClassNameInput(e.target.value)}
              value={classNameInput}
            />
          </div>

          <div>
            <div className="mt-4">
              <Button
                variant="primary"
                onClick={onAddWeaviateClass(classNameInput)}
              >
                Import Images into a class
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DataVisualizer;
