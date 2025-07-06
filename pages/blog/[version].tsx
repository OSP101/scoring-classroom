import fs from 'fs';
import path from 'path';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { Prompt } from 'next/font/google';
const kanit = Prompt({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export async function getStaticPaths() {
    const changelogPath = path.join(process.cwd(), 'data/changelog.json');
    const changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
    return {
        paths: changelog.map((item: any) => ({ params: { version: item.version } })),
        fallback: false,
    };
}

export async function getStaticProps({ params }: { params: { version: string } }) {
    const changelogPath = path.join(process.cwd(), 'data/changelog.json');
    const changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
    const data = changelog.find((item: any) => item.version === params.version);
    return { props: { data } };
}

export default function BlogVersion({ data }: { data: any }) {
    const router = useRouter();
    if (!data) return <div className="max-w-2xl mx-auto py-10">ไม่พบข้อมูลเวอร์ชันนี้</div>;
    return (
        <>
            <Head>
                <title>{data.title || data.version}</title>
                <meta name="description" content={data.highlights.join(', ')} />
            </Head>
            <div className={`max-w-2xl mx-auto py-10 px-4 ${kanit.className}`}>
                <button onClick={() => router.push('/blog')} className="mb-6 text-blue-600 hover:underline">&larr; กลับไปหน้า Blog</button>
                {data.image && (
                    <div className="mb-6">
                        <Image src={data.image} alt={data.title || data.version} width={800} height={450} className="rounded-lg object-cover w-full" />
                    </div>
                )}
                <h1 className="text-3xl font-bold mb-2">{data.title || data.version}</h1>
                <div className="text-gray-500 mb-4">{data.date} {data.author && <>| {data.author}</>}</div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Highlights</h2>
                    <ul className="list-disc ml-6 text-gray-700">
                        {data.highlights.map((hl: string, idx: number) => (
                            <li key={idx}>{hl}</li>
                        ))}
                    </ul>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">รายละเอียด</h2>
                    <ul className="list-disc ml-6 text-gray-700">
                        {data.details.map((d: any, idx: number) => (
                            <li key={idx}><span className="font-bold">{d.title}:</span> {d.desc}</li>
                        ))}
                    </ul>
                </div>
                {data.breakingChanges && data.breakingChanges.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2 text-red-600">Breaking Changes</h2>
                        <ul className="list-disc ml-6 text-red-700">
                            {data.breakingChanges.map((bc: string, idx: number) => (
                                <li key={idx}>{bc}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>

    );
} 