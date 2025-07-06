import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { Prompt } from 'next/font/google';
const kanit = Prompt({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export async function getStaticProps() {
  const changelogPath = path.join(process.cwd(), 'data/changelog.json');
  const changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
  return { props: { changelog } };
}

export default function BlogIndex({ changelog }: { changelog: any[] }) {
  return (
    <>
      <Head>
        <title>Scoring Classroom Blog</title>
        <meta name="description" content="All the latest updates and changes to the Scoring Classroom." />
      </Head>
    <div className={`max-w-3xl mx-auto py-10 px-4 ${kanit.className}`}>
      <div className="mb-8 flex flex-col items-center">
        <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text mb-2">Scoring Classroom Latest Updates</span>
        <p className="text-center text-gray-500 mb-6">All the latest updates and changes to the Scoring Classroom.</p>
      </div>
      {/* เปลี่ยนจาก space-y-8 เป็น grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {changelog.sort((a, b) => b.version.localeCompare(a.version)).map((item) => (
          <div key={item.version} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition flex flex-col">
            {item.image && (
              <div className="mb-4">
                <Image src={item.image} alt={item.title || item.version} width={800} height={450} className="rounded-lg object-cover w-full" />
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <Link href={`/blog/${item.version}`} className="text-xl font-bold text-blue-700 hover:underline mb-1">
                {item.title || item.version}
              </Link>
              <div className="text-gray-500 text-sm mb-2">{item.date} {item.author && <>| {item.author}</>}</div>
              <ul className="list-disc ml-6 text-gray-700 mb-2">
                {item.highlights.map((hl: string, idx: number) => (
                  <li key={idx}>{hl}</li>
                ))}
              </ul>
              <Link href={`/blog/${item.version}`} className="mt-auto inline-block text-blue-600 hover:underline font-medium">อ่านรายละเอียด &rarr;</Link>
            </div>
          </div>
        ))}
        </div>
      </div>
    </>
  );
} 