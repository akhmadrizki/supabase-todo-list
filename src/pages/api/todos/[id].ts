import type { APIRoute } from "astro";
import { prisma } from "../../../lib/prisma";

// UPDATE a specific todo
export const PATCH: APIRoute = async ({ request, params }) => {
  try {
    // Extract ID from dynamic route
    const todoId = params.id;

    // Validate ID
    if (!todoId) {
      return new Response(
        JSON.stringify({
          error: "Todo ID is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const { title, completed } = await request.json();

    // Validate at least one field is provided for update
    if (title === undefined && completed === undefined) {
      return new Response(
        JSON.stringify({
          error: "At least one field (title or completed) must be provided",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Prepare update data
    const updateData: { title?: string; completed?: boolean } = {};
    if (title !== undefined) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed;

    // Perform update
    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: updateData,
    });

    return new Response(JSON.stringify(updatedTodo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Update todo error:", error);

    // Handle specific Prisma error for non-existent record
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return new Response(
        JSON.stringify({
          error: "Todo not found",
          details: error.message,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: "Failed to update todo",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// DELETE a specific todo
export const DELETE: APIRoute = async ({ params }) => {
  try {
    // Extract ID from dynamic route
    const todoId = params.id;

    // Validate ID
    if (!todoId) {
      return new Response(
        JSON.stringify({
          error: "Todo ID is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Attempt to delete the todo
    await prisma.todo.delete({
      where: { id: todoId },
    });

    // Successful deletion returns 204 No Content
    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("Delete todo error:", error);

    // Handle specific Prisma error for non-existent record
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return new Response(
        JSON.stringify({
          error: "Todo not found",
          details: error.message,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: "Failed to delete todo",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
