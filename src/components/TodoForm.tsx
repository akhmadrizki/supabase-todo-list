import React, { useState } from "react";

const TodoForm: React.FC = () => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        setTitle("");
        // Optionally, trigger a refresh of todos list
      } else {
        console.error("Failed to create todo");
      }
    } catch (error) {
      console.error("Error submitting todo:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a new todo"
        className="flex-grow p-2 border rounded-l"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">
        Add Todo
      </button>
    </form>
  );
};

export default TodoForm;
