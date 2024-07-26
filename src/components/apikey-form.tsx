import { ReactEventHandler, useEffect, useState } from "react";

export default async function APIKeyForm () {
      const chatId = params.chatId?.[0];

  const [isAPIKeySet, setIsAPIKeySet] = useState(false);

  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    console.log("Checking API Key");
    const result = checkAPIKeyFromEnv();

    let resultAwaited

    result.then((data) => {
      resultAwaited = data.bool
    })

    console.log(resultAwaited);

    if (resultAwaited) {
      setIsAPIKeySet(current => !current);
    }

  }, []);
    return(
            <>
      {isAPIKeySet ? (
        <div className="w-full h-full flex">
          <div className="w-80 h-full max-h-full border-r-2 border-neutral-300 dark:border-neutral-700 overflow-auto">
            <ChatList />
          </div>
          <div className="h-full flex-1 flex flex-col">
            <ChatContent />
          </div>
        </div>
      ) : (
        <div className="grid place-items-center h-screen">
          <div className="border-white border-2 p-8 rounded-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h1 className="text-center">Enter Your API Key</h1>
            <label className="flex flex-row gap-4">
              API Key:
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                className="text-black rounded-md"
              />
            </label>
            <button type="submit" className="border-2 w-fit self-center p-2 rounded-md">Submit</button>
          </form>
          </div>
        </div>
      )}
    </>
    )
}