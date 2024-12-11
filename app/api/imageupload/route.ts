import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || "";

  if (filename && request.body) {
    const blob = await put(filename, request.body, {
      access: 'public',
      token: process.env.bonkcomichub_READ_WRITE_TOKEN,
    });

    return NextResponse.json(blob);
  } else {
    return NextResponse.json({ message: "No filename detected" });
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || "";

  if (filename && request.body) {
    try {
      // Use the `put` function to update or create the resource
      const blob = await put(filename, request.body, {
        access: 'public',
        token: process.env.bonkcomichub_READ_WRITE_TOKEN,
      });

      // Return success response
      return NextResponse.json({
        message: "Profile Pic updated successfully",
        blob,
      });
    } catch (error: any) {
      // Handle errors
      console.error("Error updating Profile pic:", error);
      return NextResponse.json(
        { message: "Failed to update image", error: error.message },
        { status: 500 }
      );
    }
  } else {
    // Handle cases where filename or body is missing
    return NextResponse.json(
      { message: "Filename and body are required for the update" },
      { status: 400 }
    );
  }
}


export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ message: "Filename is required for deletion" }, { status: 400 });
  }

  try {
    await del(filename, { token: process.env.bonkcomichub_READ_WRITE_TOKEN });
    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ message: "Failed to delete file", error: error.message }, { status: 500 });
  }
}


// import { put, del } from '@vercel/blob';
// import { NextResponse } from 'next/server';

// export async function POST(request: Request): Promise<NextResponse> {
//   const { searchParams } = new URL(request.url);
//   const filename = searchParams.get('filename') || "";

//   if (filename && request.body) {
//     const blob = await put(filename, request.body, {
//       access: 'public',
//       token: process.env.bonkcomichub_READ_WRITE_TOKEN, 
//     });

//     return NextResponse.json(blob);
//   } else {
//     return NextResponse.json({ message: "No filename detected" });
//   }
// }

// export async function DELETE(request: Request): Promise<NextResponse> {
//   const { searchParams } = new URL(request.url);
//   const filename = searchParams.get('filename');

//   if (!filename) {
//     return NextResponse.json({ message: "Filename is required for deletion" }, { status: 400 });
//   }

//   try {
//     await del(filename, { token: process.env.bonkcomichub_READ_WRITE_TOKEN });
//     return NextResponse.json({ message: "File deleted successfully" });
//   } catch (error:any) {
//     console.error('Error deleting file:', error);
//     return NextResponse.json({ message: "Failed to delete file", error: error.message }, { status: 500 });
//   }
// }
