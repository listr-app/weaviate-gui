import React, { useEffect, useState } from "react";

const ImportData = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    onGetSchema();
  }, []);

  const onGetSchema = async () => {
    const schema = await fetch("/api/weaviate/getSchema");
    const schemaJson = await schema.json();
    setClasses(schemaJson.classes);
  };

  const onGetObjectsInClass = () => async (class_name: string) => {
    async () =>
      await fetch("/api/weaviate/getObjectsInClass", {
        method: "POST",
        body: JSON.stringify({ class: class_name }),
      });
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
                  <div className="flex items-center gap-x-2" key={c.class}>
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

        <div className="mt-8 flex justify-center gap-x-4 px-16">
          <Button
            onButtonClick={async () => await fetch("/api/weaviate/addClass")}
          >
            Add weaviate class
          </Button>
          <Button
            onButtonClick={async () =>
              await fetch("/api/weaviate/searchByImage")
            }
          >
            search by image
          </Button>
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
