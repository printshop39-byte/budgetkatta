// Server component that emits a JSON-LD <script> for structured data (SEO/AEO).
// Renders nothing visible. Pass a schema.org object (or array) as `data`.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
