import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Landmark } from 'lucide-react';
import { getDistricts, getCities } from '@/lib/locations';
import { pageMetadata } from '@/lib/seo';

// Local-SEO landing page for a single district, e.g. /directory/kolhapur.
// Server-rendered so search engines get real, localized city listings that
// deep-link into the interactive directory.
export const dynamic = 'force-dynamic';

const titleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

/** Resolve a URL slug back to the exact DB district value. */
async function resolveDistrict(slug: string): Promise<string | null> {
  const districts = await getDistricts();
  return districts.find((d) => toSlug(d) === slug.toLowerCase()) ?? null;
}

export async function generateMetadata({ params }: { params: { district: string } }): Promise<Metadata> {
  const district = await resolveDistrict(params.district);
  const name = district ? titleCase(district) : titleCase(params.district.replace(/-/g, ' '));
  return pageMetadata({
    title: `${name} मधील बँका व शाखा | Banks in ${name}`,
    description: `${name} जिल्ह्यातील सर्व शहरांतील बँका, पतसंस्था व शाखा शोधा — IFSC, पत्ता व नकाशासह. Find banks, branches and IFSC codes across ${name} district.`,
    path: `/directory/${params.district}`,
  });
}

export default async function DistrictPage({ params }: { params: { district: string } }) {
  const district = await resolveDistrict(params.district);
  if (!district) notFound();
  const cities = await getCities(district);
  const name = titleCase(district);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav className="mb-4 text-sm text-slate-400 font-deva">
        <Link href="/directory" className="hover:text-amber-300">
          बँक डिरेक्टरी
        </Link>{' '}
        / <span className="text-slate-300">{name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="flex items-center gap-2 font-display text-3xl font-extrabold text-slate-100 font-deva md:text-4xl">
          <Landmark className="h-7 w-7 text-amber-400" />
          {name} मधील बँका व शाखा
        </h1>
        <p className="mt-2 text-slate-400 font-deva">
          {name} जिल्ह्यातील शहर/तालुका निवडा आणि बँका, पतसंस्था व शाखांची माहिती (IFSC, पत्ता, नकाशा) पाहा.
        </p>
      </header>

      {cities.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400 font-deva">
          या जिल्ह्याची माहिती सध्या उपलब्ध नाही.{' '}
          <Link href="/directory" className="text-amber-300 underline">
            डिरेक्टरीवर जा
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {cities.map((city) => (
            <Link
              key={city}
              href={`/directory?d=${encodeURIComponent(district)}&c=${encodeURIComponent(city)}`}
              className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-amber-400/40 hover:text-amber-300 font-deva"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-400" />
              {titleCase(city)}
            </Link>
          ))}
        </div>
      )}

      <p className="mt-10 text-xs leading-relaxed text-slate-500 font-deva">
        टीप: माहिती RBI/बँकांच्या उपलब्ध डेटावर आधारित आहे. भेट देण्यापूर्वी बँकेशी खात्री करा.
      </p>
    </div>
  );
}
