import { json } from '@sveltejs/kit';

export async function GET() {
	const response = await fetch("http://90.92.182.11:4048/ping");
  const result = await response.json();
  console.log('result', result);
  return json(result, { status: 201 });
}
