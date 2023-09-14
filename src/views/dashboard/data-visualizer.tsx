import Button from "weaviate-gui/components/buttons/button";
import React, { useEffect, useState } from "react";

const DataVisualizer = () => {
  const [classes, setClasses] = useState([]);
  const [classNameInput, setClassNameInput] = useState("");
  const [connectedToWeaviate, setConnectedToWeaviate] = useState(false);
  const [weaviateHost, setWeaviateHost] = useState("http:localhost:8080");

  useEffect(() => {
    onGetSchema();
  }, []);

  const onGetSchema = async () => {
    try {
      const schema = await fetch("/api/weaviate/getSchema");
      const schemaJson = await schema.json();
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

    await fetch("/api/weaviate/addClass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify(requestBody), // Convert the object to a JSON string
    });

    onGetSchema();
  };

  const onGetObjectsInClass = async (class_name: string) => {
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

    const classObjectsJson = await class_objects.json();
    console.log(classObjectsJson);
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

          <div className="flex flex-col items-center">
            <div>Number of Classes: {classes.length}</div>
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
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-2">
          <div>
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
