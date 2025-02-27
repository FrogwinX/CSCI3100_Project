"use client";

import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  const addCount = async () => {
    setCount(count + 1);
  };

  return (
    <div className="flex bg-base-200 place-content-center place-items-center h-screen">
      <div className="card bg-base-100 size-fit card-xl">
        <div className="card-body">
          <h2 className="card-title text-base-content">Click Counter</h2>
          <p className="text-base-content">{count}</p>
          <div className="justify-end card-actions">
            <button
              onClick={addCount}
              className="btn bg-primary text-primary-content"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
