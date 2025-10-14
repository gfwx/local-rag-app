export async function GET(request: Request) {
  const { user_id } = await request.json();
}
