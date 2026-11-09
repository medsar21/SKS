export function GET() {
  return Response.json({
    status: "ok",
    service: "sks-business-platform",
    database: "not-checked",
  });
}
