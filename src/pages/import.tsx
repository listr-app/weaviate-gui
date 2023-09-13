import React, { useEffect, useState } from "react";

const ImportData = () => {
  const [classes, setClasses] = useState([]);
  const [classNameInput, setClassNameInput] = useState("");

  useEffect(() => {
    onGetSchema();
  }, []);

  const onGetSchema = async () => {
    const schema = await fetch("/api/weaviate/getSchema");
    const schemaJson = await schema.json();
    setClasses(schemaJson.classes);
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

  const Button = ({ onButtonClick, children }: any) => {
    return (
      <button
        className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
        onClick={onButtonClick}
      >
        {children}
      </button>
    );
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#126d02] to-[#15162c] p-8 text-center">
      <div className="h-full w-full bg-slate-300">
        <div className="w-full">
          <h1 className="text-bold font-bold">My Weaviate Database</h1>
          {}
          <div className="flex flex-col items-center">
            <div>Number of Classes: {classes.length}</div>
            <div>
              <h2>My Classes</h2>
              <ul>
                {classes.map((c) => (
                  <div className="flex justify-between gap-x-2" key={c.class}>
                    <li>Class Name: {c.class}</li>
                    <Button onButtonClick={() => onGetObjectsInClass(c.class)}>
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
              <Button onButtonClick={onAddWeaviateClass(classNameInput)}>
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
            <div>
              <Button onButtonClick={onAddWeaviateClass(classNameInput)}>
                Add objects to Weaviate class
              </Button>
            </div>
            <input
              placeholder="Ex: Dogs"
              onChange={(e) => setClassNameInput(e.target.value)}
              value={classNameInput}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ImportData;

{
  /* <Button
            onButtonClick={async () => {
              const resp = await fetch("/api/weaviate/batchImport");
              console.log({ resp });
            }}
          >
            Import MTG Gathering Client Side
          </Button> */
}

{
  /* <div>
            <Button
              onButtonClick={async () =>
                await fetch("/api/weaviate/searchByImage")
              }
            >
              search by image
            </Button>
          </div> */
}
