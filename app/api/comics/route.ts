import ComicsServer from './ComicsServer';
import { NextResponse } from 'next/server';

const comicsService = new ComicsServer();



export async function POST(request: Request) {
  try {
    const { action, id, payload } = await request.json(); // Extract action, id, and payload from the request body

    switch (action) {
      case "create": {
        if (id) {
          return NextResponse.json(
            { message: "ID should not be provided for creation" },
            { status: 200 }
          );
        }
        // console.log("payload => ", payload)
        // return NextResponse.json(payload, { status: 200 });
        const response:any = await comicsService.createComic(payload);
        return NextResponse.json(response, { status: response.status });
      }
      case "update": {
        if (!id) {
          return NextResponse.json(
            { message: "ID is required for update" },
            { status: 200 }
          );
        }
        const response:any = await comicsService.updateComic(id, payload);
        return NextResponse.json(response, { status: response.status });
      }
      case "delete": {
        if (!id) {
          return NextResponse.json(
            { message: "ID is required for delete" },
            { status: 200 }
          );
        }
        const response:any = await comicsService.deleteComic(id);
        return NextResponse.json(response, { status: response.status });
      }
      default:
        return NextResponse.json(
          { message: "Invalid action provided" },
          { status: 200 }
        );
    }
  } catch (error) {
    console.error(`Error in POST /comics:`, error);
    return NextResponse.json(
      { message: "Failed to process request", error },
      { status: 200 }
    );
  }
}

// Get all comics
export async function GET() {
  try {
    const response:any = await comicsService.getAllComics();
    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    console.error('Error in GET /comics:', error);
    return NextResponse.json({ message: 'Failed to fetch comics', error }, { status: 500 });
  }
}

// Get, Update, Delete a comic by ID
export async function routeById(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const method = request.method;

  try {
    switch (method) {
      case 'GET': {
        const response:any = await comicsService.getComicById(id);
        return NextResponse.json(response, { status: response.status });
      }
      case 'PUT': {
        const payload:any = await request.json();
        const response = await comicsService.updateComic(id, payload);
        return NextResponse.json(response, { status: response.status });
      }
      case 'DELETE': {
        const response:any = await comicsService.deleteComic(id);
        return NextResponse.json(response, { status: response.status });
      }
      default:
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
  } catch (error) {
    console.error(`Error in ${method} /comics/${id}:`, error);
    return NextResponse.json({ message: `Failed to ${method} comic`, error }, { status: 500 });
  }
}
