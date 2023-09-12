import React, { useState } from "react";
import Button from "components/Button"; // Make sure to provide the correct path to your Button component

const ImportData = () => {
  const [classes, setClasses] = useState([]);

  const onGetSchema = async () => {
    const schema = await fetch("/api/weaviate/getSchema");
    const schemaJson = await schema.json();
    console.log({ schemaJson });
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#126d02] to-[#15162c] p-8">
      <div className="h-full w-full bg-slate-300">
        <h1 className="text-center">Connect to your Weaviate</h1>

        <div className="mt-8 flex flex-col gap-y-1 px-16">
          <Button variant="secondary" onClick={onGetSchema}>
            Get my account schema
          </Button>

          <br />

          <Button
            variant="secondary"
            onClick={async () => await fetch("/api/weaviate/addClass")}
          >
            add weaviate classd
          </Button>

          <br />

          <Button
            variant="secondary"
            onClick={async () => await fetch("/api/weaviate/getObjectsInClass")}
          >
            get weavite objects for class
          </Button>

          <br />

          <Button
            variant="secondary"
            onClick={async () => {
              const resp = await fetch("/api/weaviate/batchImport");
              console.log({ resp });
            }}
          >
            Import MTG Gathering Client Side
          </Button>

          <br />

          <Button
            variant="secondary"
            onClick={async () => await fetch("/api/weaviate/searchByImage")}
          >
            search by image
          </Button>

          <br />

          <Button
            variant="secondary"
            onClick={() =>
              makeUrlBlob(
                "https://cards.scryfall.io/border_crop/front/0/0/0000579f-7b35-4ed3-b44c-db2a538066fe.jpg?1562894979",
              )
            }
          >
            make a base 64 from image url
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ImportData;
