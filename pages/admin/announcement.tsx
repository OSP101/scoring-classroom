import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, Card, CardBody, CardHeader, Chip, Spinner, useDisclosure } from '@heroui/react';
import { XCircleIcon, PlusIcon, PhotoIcon, DocumentTextIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useSession } from "next-auth/react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Head from 'next/head'
import WatermarkOverlay from "@/Components/WatermarkOverlay";
import Link from 'next/link';
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

interface Banner {
    id: number;
    type: 'text' | 'image';
    content: string;
    filename?: string;
    is_active: boolean;
    display_order: number;
    created_at: string;
}

export default function AdminAnnouncement() {
    const { data: session } = useSession();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [text, setText] = useState('');
    const [displayOrder, setDisplayOrder] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Load existing banners
    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/v2/admin/announcement', {
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                }
            });
            if (response.ok) {
                const data = await response.json();
                setBanners(data);
            } else {
                showAlert('ไม่สามารถโหลดข้อมูลแบนเนอร์ได้', 'error');
            }
        } catch (error) {
            console.error('Error loading banners:', error);
            showAlert('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showAlert = (message: string, severity: 'success' | 'error') => {
        setAlert({ message, severity });
    };

    const handleCloseAlert = () => {
        setAlert(null);
    };

    // Add text banner
    const addTextBanner = async () => {
        if (!text.trim()) {
            showAlert('กรุณากรอกข้อความ', 'error');
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('/api/v2/admin/announcement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: JSON.stringify({
                    type: 'text',
                    content: text.trim(),
                    display_order: displayOrder
                }),
            });

            if (response.ok) {
                showAlert('เพิ่มข้อความประกาศสำเร็จ', 'success');
                setText('');
                setDisplayOrder(0);
                loadBanners();
            } else {
                const error = await response.json();
                showAlert(error.message || 'เกิดข้อผิดพลาด', 'error');
            }
        } catch (error) {
            console.error('Error adding text banner:', error);
            showAlert('เกิดข้อผิดพลาดในการเพิ่มข้อความ', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Add image banner
    const addImageBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setIsUploading(true);
            const file = files[0];
            
            // Upload image first
            const formData = new FormData();
            formData.append('banner', file);

            const uploadResponse = await fetch('/api/v2/admin/upload-banner', {
                method: 'POST',
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: formData,
            });

            if (!uploadResponse.ok) {
                const error = await uploadResponse.json();
                throw new Error(error.message || 'อัปโหลดรูปภาพไม่สำเร็จ');
            }

            const uploadResult = await uploadResponse.json();

            // Create banner record
            const bannerResponse = await fetch('/api/v2/admin/announcement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: JSON.stringify({
                    type: 'image',
                    content: uploadResult.imagePath,
                    filename: uploadResult.filename,
                    display_order: displayOrder
                }),
            });

            if (bannerResponse.ok) {
                showAlert('เพิ่มรูปภาพประกาศสำเร็จ', 'success');
                setDisplayOrder(0);
                loadBanners();
            } else {
                const error = await bannerResponse.json();
                showAlert(error.message || 'เกิดข้อผิดพลาด', 'error');
            }
        } catch (error) {
            console.error('Error adding image banner:', error);
            showAlert(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเพิ่มรูปภาพ', 'error');
        } finally {
            setIsUploading(false);
            if (fileInput.current) fileInput.current.value = '';
        }
    };

    // Toggle banner visibility
    const toggleBannerVisibility = async (banner: Banner) => {
        try {
            const response = await fetch('/api/v2/admin/announcement', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: JSON.stringify({
                    id: banner.id,
                    type: banner.type,
                    content: banner.content,
                    filename: banner.filename,
                    is_active: !banner.is_active,
                    display_order: banner.display_order
                }),
            });

            if (response.ok) {
                showAlert(`เปลี่ยนสถานะแบนเนอร์สำเร็จ`, 'success');
                loadBanners();
            } else {
                const error = await response.json();
                showAlert(error.message || 'เกิดข้อผิดพลาด', 'error');
            }
        } catch (error) {
            console.error('Error toggling banner visibility:', error);
            showAlert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ', 'error');
        }
    };

    // Remove banner
    const removeBanner = async (id: number) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบแบนเนอร์นี้?')) return;

        try {
            const response = await fetch(`/api/v2/admin/announcement?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                }
            });

            if (response.ok) {
                showAlert('ลบแบนเนอร์สำเร็จ', 'success');
                loadBanners();
            } else {
                const error = await response.json();
                showAlert(error.message || 'เกิดข้อผิดพลาด', 'error');
            }
        } catch (error) {
            console.error('Error removing banner:', error);
            showAlert('เกิดข้อผิดพลาดในการลบแบนเนอร์', 'error');
        }
    };

    if (!session) {
        return (
            <div className="max-w-2xl mx-auto p-4">
                <div className="text-center text-gray-500">กรุณาเข้าสู่ระบบเพื่อจัดการแบนเนอร์</div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Admin Users | Scoring Classroom</title>
            </Head>
            <div className="container mx-auto flex justify-center mt-5">

                <WatermarkOverlay name={session?.user?.name || ""} email={session?.user?.email || ""} />
                <aside
                    className={`relative z-40 w-64 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } bg-white sm:translate-x-0 dark:bg-black`}
                    aria-label="Sidebar"
                >
                    <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-black">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <Link href={`/admin/users`} className="flex items-center p-2 pl-4 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-sm group">
                                    <span className={`ms-3 ${kanit.className}`}>Users</span>
                                </Link>

                            </li>
                            <li>
                                <Link href={`/admin/subject`} className="flex items-center p-2 pl-4 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-sm group">
                                    <span className={`flex-1 ms-3 whitespace-nowrap ${kanit.className}`}>Subjects</span>
                                </Link>
                            </li>
                            <li>
                                <Link href={`/admin/announcement`} className="flex items-center p-2 pl-4 bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white rounded-lg text-sm group">
                                    <span className={`flex-1 ms-3 whitespace-nowrap ${kanit.className}`}>Announcement</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </aside>

                <div className="w-full border rounded-lg dark:border-gray-800 p-4 dark:bg-gray-900 border-gray-200">
                    <div className="max-w-4xl mx-auto p-4 space-y-6">
                        <h1 className="text-2xl font-bold mb-2">จัดการป้ายประกาศประชาสัมพันธ์</h1>

                        <Card>
                            <CardHeader className="font-semibold text-lg">เพิ่มป้ายประกาศ</CardHeader>
                            <CardBody className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Input
                                            placeholder="ข้อความประกาศ..."
                                            value={text}
                                            onChange={e => setText(e.target.value)}
                                            startContent={<DocumentTextIcon className="w-5 h-5 text-gray-400" />}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="ลำดับการแสดงผล (0 = แสดงก่อน)"
                                            value={displayOrder.toString()}
                                            onChange={e => setDisplayOrder(parseInt(e.target.value) || 0)}
                                            startContent={<span className="text-gray-400">#</span>}
                                        />
                                        <Button
                                            color="primary"
                                            onClick={addTextBanner}
                                            isDisabled={isLoading || !text.trim()}
                                            startContent={isLoading ? <Spinner size="sm" /> : <PlusIcon className="w-5 h-5" />}
                                        >
                                            {isLoading ? 'กำลังเพิ่ม...' : 'เพิ่มข้อความ'}
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInput}
                                            onChange={addImageBanner}
                                            className="hidden"
                                            id="banner-image-upload"
                                        />
                                        <label htmlFor="banner-image-upload">
                                            <Button
                                                as="span"
                                                color="secondary"
                                                startContent={isUploading ? <Spinner size="sm" /> : <PhotoIcon className="w-5 h-5" />}
                                                isDisabled={isUploading}
                                                className="w-full"
                                            >
                                                {isUploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพ'}
                                            </Button>
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="ลำดับการแสดงผล (0 = แสดงก่อน)"
                                            value={displayOrder.toString()}
                                            onChange={e => setDisplayOrder(parseInt(e.target.value) || 0)}
                                            startContent={<span className="text-gray-400">#</span>}
                                        />
                                        <span className="text-xs text-gray-400 block">รองรับไฟล์รูปภาพ ขนาดสูงสุด 5MB</span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader className="font-semibold text-lg">รายการป้ายประกาศ</CardHeader>
                            <CardBody>
                                {isLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Spinner size="lg" />
                                    </div>
                                ) : banners.length === 0 ? (
                                    <p className="text-gray-400 text-center py-8">ยังไม่มีป้ายประกาศ</p>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {banners.map((banner) => (
                                            <div key={banner.id} className="relative flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                                {banner.type === 'image' ? (
                                                    <img
                                                        src={banner.content}
                                                        alt={banner.filename || 'banner'}
                                                        className="w-24 h-16 object-cover rounded-md border"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                                        <DocumentTextIcon className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                                        <span className="text-base font-medium truncate">{banner.content}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <Chip size="sm" color={banner.type === 'image' ? 'secondary' : 'primary'} variant="flat">
                                                        {banner.type === 'image' ? 'รูปภาพ' : 'ข้อความ'}
                                                    </Chip>
                                                    <Chip size="sm" color={banner.is_active ? 'success' : 'default'} variant="flat">
                                                        {banner.is_active ? 'แสดง' : 'ซ่อน'}
                                                    </Chip>
                                                    <span className="text-xs text-gray-500">#{banner.display_order}</span>
                                                </div>

                                                <div className="flex items-center gap-2 absolute top-2 right-2">
                                                    <Button
                                                        isIconOnly
                                                        variant="light"
                                                        color={banner.is_active ? 'warning' : 'success'}
                                                        size="sm"
                                                        onClick={() => toggleBannerVisibility(banner)}
                                                    >
                                                        {banner.is_active ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        variant="light"
                                                        color="danger"
                                                        size="sm"
                                                        onClick={() => removeBanner(banner.id)}
                                                    >
                                                        <XCircleIcon className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        <Snackbar open={!!alert} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                            <Alert onClose={handleCloseAlert} severity={alert?.severity} variant="filled" sx={{ width: '100%' }}>
                                {alert?.message}
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
            </div>
        </>
    );
} 