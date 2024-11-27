import type { APIRoute } from "astro";
import { prisma } from "../../lib/prisma";

export const GET: APIRoute = async () => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify(todos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch todos" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { title } = await request.json();
    const todo = await prisma.todo.create({
      data: { title, completed: false },
    });
    return new Response(JSON.stringify(todo), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create todo" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const PATCH: APIRoute = async ({ request, params }) => {
  try {
    const { id } = params;
    const { completed } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Todo ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed },
    });

    return new Response(JSON.stringify(updatedTodo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update todo" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: "Todo ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await prisma.todo.delete({
      where: { id },
    });

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete todo" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
