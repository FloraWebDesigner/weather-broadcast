"use client";

import addHost from "@app/actions/addHost";

export default function GetHost() {
  return (
    <main className="flex justify-center items-center w-1/2 mx-auto my-20">
      <form action={addHost} className="flex gap-2 w-full">
        <input
          type="text"
          name="host"
          placeholder="Enter your name"
          className="rounded shadow appearance-none border border-slate-500 py-2 px-3 w-2/3"
          required
        />
        <button
          type="submit"
          className="bg-green-500 py-2 px-4 rounded font-bold hover:border-green-700 w-1/3"
        >
          Add Host
        </button>
      </form>
    </main>
  );
}
