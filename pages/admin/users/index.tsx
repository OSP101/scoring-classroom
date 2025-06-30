"use client"
import Head from 'next/head'
import { useState, useEffect, useRef } from "react";
import type { SVGProps } from "react";
import type { Selection, ChipProps, SortDescriptor, PaginationItemRenderProps } from "@heroui/react";
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });
import { FaFileExcel, FaCloudUploadAlt, FaIdCard, FaRegUser, FaLock, FaTimes } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";
import WatermarkOverlay from "@/Components/WatermarkOverlay";
import { useSession, signIn } from "next-auth/react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    cn,
    PaginationItemType,
    user,
    Spinner,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Tabs, Tab, Avatar, Select, SelectItem, RadioGroup, Radio, Card, CardBody
} from "@heroui/react";
import Link from "next/link";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

interface ImageUploadModalProps {
    isOpenAdd: boolean;
    onOpenChangeAdd: (isOpen: boolean) => void;
    imagePath?: string;
}

interface UploadResponse {
    imagePath: string;
    message: string;
}

interface UserFormData {
    stdid: string;
    fullname: string;
    email: string;
    imagePath?: string;
    role: string;
}

export const ChevronIcon = (props: IconSvgProps) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M15.5 19l-7-7 7-7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            />
        </svg>
    );
};

export const PlusIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            >
                <path d="M6 12h12" />
                <path d="M12 18V6" />
            </g>
        </svg>
    );
};

export const VerticalDotsIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <path
                d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="currentColor"
            />
        </svg>
    );
};

export const SearchIcon = (props: IconSvgProps) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
};

export const ChevronDownIcon = ({ strokeWidth = 1.5, ...otherProps }: IconSvgProps) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...otherProps}
        >
            <path
                d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "ROLE", uid: "role", sortable: true },
    { name: "EMAIL", uid: "email" },
    { name: "ACTIONS", uid: "actions" },
];
type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    team: string;
    status: string;
    avatar: string;
};





const INITIAL_VISIBLE_COLUMNS = ["name", "role", "id", "email", "actions"];

export const tracks = [
    { key: "web", label: "Web and Mobile" },
    { key: "bit", label: "BIT" },
    { key: "network", label: "Network" },
    { key: "-", label: "-" }
];



const App = () => {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS),
    );
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "role",
        direction: "ascending",
    });

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onOpenChange: onOpenChangeAdd } = useDisclosure();
    const { isOpen: isOpenImport, onOpen: onOpenImport, onOpenChange: onOpenChangeImport } = useDisclosure();
    const { isOpen: isOpenView, onOpen: onOpenView, onOpenChange: onOpenChangeView } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure();

    // State for viewing user details
    const [selectedUserForView, setSelectedUserForView] = useState<any>(null);
    const [isViewLoading, setIsViewLoading] = useState(false);

    // State for editing user
    const [editingUser, setEditingUser] = useState<any>(null);
    const [editFormData, setEditFormData] = useState({ name: '', email: '' });
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);

    // State for file import
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false); // Used for both preview and final import
    const [importResult, setImportResult] = useState<{ message: string; details?: any[] } | null>(null);
    const [isDragging, setIsDragging] = useState(false); // Used for import modal
    const importFileInputRef = useRef<HTMLInputElement>(null);
    const [previewData, setPreviewData] = useState<{ validUsers: any[], invalidRows: any[] } | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/v2/admin/users", {
                headers: {
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();

            const formatted = data.map((u: any) => ({
                id: u.stdid,
                name: u.name,
                email: u.email,
                role: u.type === 1 ? "TA" : u.type === 2 ? "Student" : "Teacher",
                team: u.track || "-",
                status: "active",
                avatar: u.image,
            }));

            setUsers(formatted);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.id.includes(filterValue) ||
                user.email.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
            );
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: User, b: User) => {
            const column = sortDescriptor.column as keyof User;
            const first = a[column];
            const second = b[column];

            // จัดการกับ string หรือ number ได้ทั้งคู่
            if (typeof first === "string" && typeof second === "string") {
                const cmp = first.localeCompare(second);
                return sortDescriptor.direction === "descending" ? -cmp : cmp;
            }

            if (typeof first === "number" && typeof second === "number") {
                const cmp = first < second ? -1 : first > second ? 1 : 0;
                return sortDescriptor.direction === "descending" ? -cmp : cmp;
            }

            return 0; // fallback
        });
    }, [sortDescriptor, items]);


    const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof User];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        description={user.email}
                        name={cellValue}
                    >
                        {user.email}
                    </User>
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                        <p className="text-bold text-tiny capitalize text-default-400">{user.team}</p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem
                                    key="view"
                                    onPress={() => handleViewUser(user.id)}
                                >
                                    View
                                </DropdownItem>
                                <DropdownItem key="edit" onPress={() => handleEdit(user)}>Edit</DropdownItem>
                                <DropdownItem key="delete" className="text-danger" color="danger">
                                    Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by ID, Name, or Email"
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                        size="sm"
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat" size="sm">
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white" size="sm" onPress={onOpenAdd} endContent={<PlusIcon />}>
                            Create Users
                        </Button>
                        <Button className="bg-green-600 text-white" onPress={onOpenImport} size="sm" endContent={<FaFileExcel />}>
                            Import Users
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {users.length} users</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        users.length,
        hasSearchFilter,
        onOpenImport
    ]);

    const bottomContent = React.useMemo(() => {
        const renderItem = ({
            ref,
            key,
            value,
            isActive,
            onNext,
            onPrevious,
            setPage,
            className,
        }: PaginationItemRenderProps) => {
            if (value === PaginationItemType.NEXT) {
                return (
                    <button
                        key={key}
                        className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
                        onClick={onNext}
                    >
                        <ChevronIcon className="rotate-180" />
                    </button>
                );
            }

            if (value === PaginationItemType.PREV) {
                return (
                    <button
                        key={key}
                        className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
                        onClick={onPrevious}
                    >
                        <ChevronIcon />
                    </button>
                );
            }

            if (value === PaginationItemType.DOTS) {
                return (
                    <button key={key} className={className}>
                        ...
                    </button>
                );
            }

            // cursor is the default item
            return (
                <button
                    key={key}
                    ref={ref}
                    className={cn(
                        className,
                        isActive && "text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold",
                    )}
                    onClick={() => setPage(value)}
                >
                    {value}
                </button>
            );
        };

        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${filteredItems.length} selected`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="danger"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [selected, setSelected] = React.useState<React.Key>("login");
    const { data: session } = useSession()
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file selection and preview
    const handleFileSelect = async (file: File): Promise<void> => {
        if (file) {
            // Validate file type
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please select a PNG or JPG image');
                return;
            }

            // Validate file size (5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                alert('File size must be less than 5MB');
                return;
            }

            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    setImagePreview(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload image to server (จะเรียกเมื่อกดบันทึก)
    const uploadImageToServer = async (file: File): Promise<string | null> => {
        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('image', file);

            // เรียก API เพื่ออัปโหลดรูปภาพ
            const response = await fetch('/api/v2/admin/upload-image', {
                method: 'POST',
                headers: {
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const result: UploadResponse = await response.json();
            console.log('Image uploaded successfully:', result.imagePath);
            return result.imagePath;

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    // Handle click on upload area
    const handleUploadClick = (): void => {
        fileInputRef.current?.click();
    };

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // Handle drag events for Image Upload
    const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleImageDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleImageDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // Remove selected image
    const removeImage = async (): Promise<void> => {
        // หากมี path ของรูปภาพที่อัปโหลดแล้ว ให้ลบออกจากเซิร์ฟเวอร์
        if (uploadedImagePath) {
            try {
                await fetch('/api/v2/admin/delete-image', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                    },
                    body: JSON.stringify({ imagePath: uploadedImagePath }),
                });
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        setSelectedImage(null);
        setImagePreview(null);
        setUploadedImagePath(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, onClose: () => void): Promise<void> => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Get form data
            const formData = new FormData(e.currentTarget);
            let imagePath: string | undefined;

            // 1. Upload image if provided, otherwise use default
            if (selectedImage) {
                const uploadedPath = await uploadImageToServer(selectedImage);
                if (uploadedPath) {
                    imagePath = uploadedPath;
                } else {
                    // Stop if upload fails
                    setIsSubmitting(false);
                    return;
                }
            } else {
                // Use default image if none is selected
                imagePath = '/profile-img.png';
            }

            // 2. Create user data object with role
            const userData: UserFormData = {
                stdid: formData.get('stdid') as string,
                fullname: formData.get('fullname') as string,
                email: formData.get('email') as string,
                role: formData.get('role') as string,
                imagePath: imagePath,
            };

            // 3. Send data to API
            const response = await fetch('/api/v2/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create user');
            }

            const result = await response.json();
            console.log('User created successfully:', result);

            alert('User created successfully!');

            // Reset form
            (e.target as HTMLFormElement).reset();
            setSelectedImage(null);
            setImagePreview(null);
            setUploadedImagePath(null);

            // Use the passed onClose function
            onClose();

            // Refresh page or update user list
            // window.location.reload();
            fetchUsers();

        } catch (error) {
            console.error('Error creating user:', error);
            alert(error instanceof Error ? error.message : 'Failed to create user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChangeForImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                'application/vnd.ms-excel', // .xls
                'text/csv', // .csv
            ];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a .xls, .xlsx, or .csv file.');
                e.target.value = ''; // Clear the input
                return;
            }
            setImportFile(file);
            setImportResult(null); // Reset previous results
        }
    };

    const handlePreviewRequest = async () => {
        if (!importFile) {
            alert('Please select a file to preview.');
            return;
        }

        setIsImporting(true);
        setPreviewData(null);
        setImportResult(null);

        const formData = new FormData();
        formData.append('file', importFile);

        try {
            const response = await fetch('/api/v2/admin/preview-import', {
                method: 'POST',
                headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? '' },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to generate preview.');
            }

            setPreviewData(result);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setImportResult({ message: `Preview failed: ${errorMessage}` });
        } finally {
            setIsImporting(false);
        }
    };

    const handleExecuteImport = async () => {
        if (!previewData || previewData.validUsers.length === 0) {
            alert('No valid users to import.');
            return;
        }

        setIsImporting(true);
        setImportResult(null);

        try {
            const response = await fetch('/api/v2/admin/execute-import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? '',
                },
                body: JSON.stringify({ usersToImport: previewData.validUsers }),
            });

            const result = await response.json();

            if (!response.ok && response.status !== 207) { // 207 is partial success
                throw new Error(result.message || 'Failed to execute import.');
            }

            setImportResult({ message: result.message, details: result.errors });
            setPreviewData(null); // Clear preview data after import
            setImportFile(null);  // Clear the file
            fetchUsers(); // Refresh the main user list
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setImportResult({ message: `Import failed: ${errorMessage}` });
        } finally {
            setIsImporting(false);
        }
    };

    const resetImportModal = (onClose: () => void) => {
        onClose();
        setImportFile(null);
        setPreviewData(null);
        setImportResult(null);
        setIsDragging(false);
    };

    // Generic Handlers for any drag-and-drop UI
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, setDragging: React.Dispatch<React.SetStateAction<boolean>>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, setDragging: React.Dispatch<React.SetStateAction<boolean>>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation(); // Necessary to allow drop
    };

    const handleDropForImport = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            // Manually create a ChangeEvent to reuse the existing handler
            const mockEvent = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleFileChangeForImport(mockEvent);
        }
    };

    const handleViewUser = async (userStdid: string) => {
        if (!userStdid) return;
        onOpenView();
        setIsViewLoading(true);
        setSelectedUserForView(null);
        try {
            const response = await fetch(`/api/v2/admin/user-details/${userStdid}`, {
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const data = await response.json();
            setSelectedUserForView(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsViewLoading(false);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setEditFormData({ name: user.name, email: user.email });
        setEditPreviewUrl(user.avatar); // Assuming user object has avatar url
        setEditImageFile(null);
        onOpenEdit();
    };

    const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingUser) return;

        let imagePath = editingUser.avatar;

        if (editImageFile) {
             const uploadedPath = await uploadImageToServer(editImageFile);
             if(uploadedPath) {
                imagePath = uploadedPath;
             }
        }

        try {
            const response = await fetch('/api/v2/admin/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
                },
                body: JSON.stringify({
                    stdid: editingUser.id,
                    name: editFormData.name,
                    email: editFormData.email,
                    imagePath: imagePath,
                }),
            });

            if (response.ok) {
                onOpenChangeEdit;
                fetchUsers(); // Refresh the user list
            } else {
                const errorData = await response.json();
                console.error("Failed to update user:", errorData.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setEditImageFile(file);
            setEditPreviewUrl(URL.createObjectURL(file));
        }
    };

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
                            <Link href={`/admin/users`} className="flex items-center p-2 pl-4 bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white rounded-lg text-sm group">
                                <span className={`ms-3 ${kanit.className}`}>Users</span>
                            </Link>

                        </li>
                        <li>
                            <Link href={`/admin/subject`} className="flex items-center p-2 pl-4 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-sm group">
                                <span className={`flex-1 ms-3 whitespace-nowrap ${kanit.className}`}>Subjects</span>
                            </Link>
                        </li>
                        <li>
                                <Link href={`/admin/announcement`} className="flex items-center p-2 pl-4 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-sm group">
                                    <span className={`flex-1 ms-3 whitespace-nowrap ${kanit.className}`}>Announcement</span>
                                </Link>
                            </li>
                    </ul>
                </div>
            </aside>

            <div className="w-full border rounded-lg dark:border-gray-800 p-4 dark:bg-gray-900 border-gray-200">
                <Table
                    isHeaderSticky
                    aria-label="Example table with custom cells, pagination and sorting"
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
                    className={`${kanit.className}`}
                    selectedKeys={selectedKeys}
                    selectionMode="multiple"
                    sortDescriptor={sortDescriptor}
                    topContent={topContent}
                    topContentPlacement="outside"
                    onSelectionChange={setSelectedKeys}
                    onSortChange={setSortDescriptor}

                >
                    <TableHeader columns={headerColumns} className={`${kanit.className}`}>
                        {(column) => (
                            <TableColumn
                                key={column.uid}
                                align={column.uid === "actions" ? "center" : "start"}
                                allowsSorting={column.sortable}
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody emptyContent={"No users found"} items={sortedItems} isLoading={isLoading} className={`${kanit.className}`} loadingContent={<Spinner label="Loading..." color="danger" variant="wave" />}>
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Modal isOpen={isOpenAdd} onOpenChange={onOpenChangeAdd} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Create Users</ModalHeader>
                            <ModalBody>
                                <form className="flex flex-col gap-4" onSubmit={(e) => {
                                    // Pass onClose to handleSubmit
                                    handleSubmit(e, onClose);
                                }}>
                                    <div className="flex w-full gap-4">
                                        <div className="w-1/3 mr-3">
                                            <div className="h-full mb-4 pb-4">
                                                <p className="text-sm mb-2">Upload Image (Optional)</p>

                                                {/* Hidden file input */}
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/jpg"
                                                    onChange={handleFileInputChange}
                                                    className="hidden"
                                                />

                                                {/* Upload area */}
                                                <div
                                                    className={`border-2 border-dashed w-full h-48 text-sm rounded cursor-pointer transition-colors ${dragOver
                                                            ? 'border-blue-400 bg-blue-50'
                                                            : imagePreview
                                                                ? 'border-green-300 bg-green-50'
                                                                : 'border-gray-300 bg-gray-100'
                                                        } ${!imagePreview ? 'flex justify-center items-center' : 'relative'}`}
                                                    onClick={!imagePreview ? handleUploadClick : undefined}
                                                    onDragOver={handleDragOver}
                                                    onDragEnter={(e) => handleDragEnter(e, setDragOver)}
                                                    onDragLeave={(e) => handleDragLeave(e, setDragOver)}
                                                    onDrop={handleImageDrop}
                                                >
                                                    {imagePreview ? (
                                                        <div className="relative w-full h-full">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover rounded"
                                                            />
                                                            {/* Loading overlay */}
                                                            {isUploading && (
                                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                                                </div>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={removeImage}
                                                                disabled={isUploading}
                                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-full p-1 transition-colors"
                                                            >
                                                                <FaTimes size={12} />
                                                            </button>
                                                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                                                {selectedImage?.name}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <FaCloudUploadAlt className="text-4xl text-center mx-auto mb-2" />
                                                            <span className="font-medium text-sm block">
                                                                {dragOver ? 'Drop image here' : 'Click to Upload'}
                                                            </span>
                                                            <span className="text-xs text-gray-600">
                                                                or drag and drop
                                                            </span>
                                                            <br />
                                                            <span className="text-xs text-gray-500">
                                                                PNG or JPG (MAX. 5.0 MB)
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Change image button when image is selected */}
                                                {imagePreview && !isUploading && (
                                                    <button
                                                        type="button"
                                                        onClick={handleUploadClick}
                                                        className="mt-2 w-full text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                                    >
                                                        Change Image
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-2/3 flex flex-col gap-4">
                                            <Input
                                                name="stdid"
                                                autoFocus
                                                isRequired
                                                radius="sm"
                                                variant="bordered"
                                                labelPlacement="outside"
                                                label="STDID"
                                                placeholder="Enter your STDID"
                                                type="text"
                                                minLength={11}
                                                maxLength={11}
                                                startContent={<FaIdCard />}
                                            />
                                            <Input
                                                name="fullname"
                                                isRequired
                                                radius="sm"
                                                variant="bordered"
                                                labelPlacement="outside"
                                                label="Full name"
                                                placeholder="Enter your name"
                                                type="text"
                                                startContent={<FaRegUser />}
                                            />
                                            <Input
                                                name="email"
                                                isRequired
                                                radius="sm"
                                                variant="bordered"
                                                labelPlacement="outside"
                                                label="Email"
                                                placeholder="Enter your email"
                                                type="email"
                                                startContent={<FaLock />}
                                            />
                                            <RadioGroup
                                                name="role"
                                                label="Select user role"
                                                isRequired
                                                defaultValue="2"
                                                orientation="horizontal"
                                            >
                                                <Radio value="2">Student</Radio>
                                                <Radio value="1">TA</Radio>
                                            </RadioGroup>
                                        </div>
                                    </div>

                                    <div className="flex justify-end w-full my-3">
                                        <div className="flex gap-2 justify-end w-1/2">
                                            <Button
                                                fullWidth
                                                variant="light"
                                                onPress={onClose}
                                                isDisabled={isUploading || isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                fullWidth
                                                type="submit"
                                                isLoading={isUploading || isSubmitting}
                                                isDisabled={isUploading || isSubmitting}
                                                className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white"
                                            >
                                                {isUploading ? 'Uploading...' : isSubmitting ? 'Creating...' : 'Create Users'}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenImport} onOpenChange={onOpenChangeImport} size="2xl" placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-base">Import Users from File</ModalHeader>
                            <ModalBody className="max-h-[70vh] overflow-y-auto">
                                {!previewData && (
                                    <>
                                        <div
                                            className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
                                            onDragEnter={(e) => handleDragEnter(e, setIsDragging)}
                                            onDragLeave={(e) => handleDragLeave(e, setIsDragging)}
                                            onDragOver={handleDragOver}
                                            onDrop={handleDropForImport}
                                            onClick={() => importFileInputRef.current?.click()}
                                        >
                                            <input
                                                ref={importFileInputRef}
                                                type="file"
                                                accept=".xls, .xlsx, .csv"
                                                onChange={handleFileChangeForImport}
                                                className="hidden"
                                            />
                                            <div className="flex flex-col items-center justify-center">
                                                <FaFileExcel className="text-4xl text-gray-400 mb-3" />
                                                {importFile ? (
                                                    <>
                                                        <p className="font-semibold text-gray-800">{importFile.name}</p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            File selected. Click below to generate a preview.
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="font-semibold text-gray-800">
                                                            Drag & Drop your file here
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            or <span className="text-indigo-600 font-medium">click to browse</span>
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-3">Supports: .xls, .xlsx, .csv</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 text-sm text-gray-600">
                                            <h3 className="font-semibold text-gray-800">File Format Guide:</h3>
                                            <ul className="list-disc list-inside mt-1 pl-2 bg-gray-50 p-3 rounded-md">
                                                <li><span className="font-medium">Column B:</span> Student ID (11 digits)</li>
                                                <li><span className="font-medium">Column C:</span> Full Name</li>
                                                <li><span className="font-medium">Column D:</span> Email Address</li>
                                            </ul>
                                        </div>
                                    </>
                                )}

                                {isImporting && !importResult && <Spinner label="Generating Preview..." color="secondary" />}

                                {previewData && (
                                    <div className='flex flex-col gap-4'>
                                        <div>
                                            <h3 className="font-semibold text-green-700">
                                                {`Ready to Import (${previewData.validUsers.length} users)`}
                                            </h3>
                                            <Table removeWrapper aria-label="Valid users table" className="mt-2">
                                                <TableHeader>
                                                    <TableColumn>STDID</TableColumn>
                                                    <TableColumn>NAME</TableColumn>
                                                    <TableColumn>EMAIL</TableColumn>
                                                </TableHeader>
                                                <TableBody items={previewData.validUsers} emptyContent="No valid users found.">
                                                    {(item: any) => (
                                                        <TableRow key={item.stdid}>
                                                            <TableCell>{item.stdid}</TableCell>
                                                            <TableCell>{item.name}</TableCell>
                                                            <TableCell>{item.email}</TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        {previewData.invalidRows.length > 0 && (
                                            <div>
                                                <h3 className="font-semibold text-red-700">
                                                    {`Invalid Rows (${previewData.invalidRows.length} rows)`}
                                                </h3>
                                                <Table removeWrapper aria-label="Invalid users table" className="mt-2">
                                                    <TableHeader>
                                                        <TableColumn>ROW</TableColumn>
                                                        <TableColumn>STDID</TableColumn>
                                                        <TableColumn>NAME</TableColumn>
                                                        <TableColumn>REASON</TableColumn>
                                                    </TableHeader>
                                                    <TableBody items={previewData.invalidRows}>
                                                        {(item: any) => (
                                                            <TableRow key={item.row}>
                                                                <TableCell>{item.row}</TableCell>
                                                                <TableCell>{item.data.stdid}</TableCell>
                                                                <TableCell>{item.data.name}</TableCell>
                                                                <TableCell>{item.reason}</TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                    </div>
                                )}


                                {importResult && (
                                    <div className={`mt-4 p-3 rounded-lg text-sm ${importResult.details && importResult.details.length > 0 ? 'bg-orange-50 text-orange-800 border border-orange-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
                                        <p className="font-semibold">{importResult.message}</p>
                                        {importResult.details && importResult.details.length > 0 && (
                                            <>
                                                <p className='font-medium mt-2'>Details:</p>
                                                <ul className="list-disc list-inside mt-1 max-h-24 overflow-y-auto">
                                                    {importResult.details.map((error, index) => (
                                                        <li key={index}>{`Row ${error.row}: ${error.reason}`}</li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={() => resetImportModal(onClose)} disabled={isImporting}>
                                    {previewData || importResult ? 'Close' : 'Cancel'}
                                </Button>
                                {previewData ? (
                                    <Button
                                        color="success"
                                        className='text-white'
                                        onPress={handleExecuteImport}
                                        isLoading={isImporting}
                                        disabled={isImporting || previewData.validUsers.length === 0}
                                        startContent={!isImporting ? <MdCloudUpload /> : null}
                                    >
                                        {`Import ${previewData.validUsers.length} Users`}
                                    </Button>
                                ) : (
                                    <Button
                                        color="secondary"
                                        variant='flat'
                                        onPress={handlePreviewRequest}
                                        isLoading={isImporting}
                                        disabled={!importFile || isImporting}
                                    >
                                        Generate Preview
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* View User Modal */}
            <Modal isOpen={isOpenView} onOpenChange={onOpenChangeView} size="4xl" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">User Details</ModalHeader>
                            <ModalBody>
                                {isViewLoading ? (
                                    <div className="flex justify-center items-center h-96">
                                        <Spinner label="Loading..." />
                                    </div>
                                ) : selectedUserForView ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Left Column: User Info */}
                                        <div className="md:col-span-1 flex flex-col items-center text-center space-y-4">
                                            <Avatar src={selectedUserForView.profile.image} className="w-32 h-32 text-large shadow-md" />
                                            <div>
                                                <h2 className="text-2xl font-bold">{selectedUserForView.profile.name}</h2>
                                                <p className="text-default-500">{selectedUserForView.profile.email}</p>
                                                <p className="text-default-500">{selectedUserForView.profile.stdid}</p>
                                            </div>
                                            <Chip
                                                color={selectedUserForView.profile.type === 2 ? 'default' : selectedUserForView.profile.type === 1 ? 'secondary' : 'primary'}
                                                variant="flat"
                                            >
                                                {selectedUserForView.profile.type === 2 ? 'Student' : selectedUserForView.profile.type === 1 ? 'TA' : 'Teacher'}
                                            </Chip>
                                             <Card className="w-full mt-4">
                                                <CardBody>
                                                    <h4 className="font-bold text-lg mb-2">Profile Details</h4>
                                                    <p><strong>Track:</strong> {selectedUserForView.profile.track || 'N/A'}</p>
                                                </CardBody>
                                            </Card>
                                        </div>

                                        {/* Right Column: Courses and Activity */}
                                        <div className="md:col-span-2 space-y-6">
                                            {/* Enrolled Courses */}
                                            <div>
                                                <h3 className="text-xl font-semibold mb-2">
                                                    {`Courses (${selectedUserForView.enrolledCourses.length})`}
                                                </h3>
                                                <Card>
                                                    <CardBody className="p-0">
                                                        <Table removeWrapper aria-label="Enrolled Courses">
                                                            <TableHeader>
                                                                <TableColumn>CODE</TableColumn>
                                                                <TableColumn>NAME</TableColumn>
                                                                <TableColumn>YEAR</TableColumn>
                                                                <TableColumn>SEMESTER</TableColumn>
                                                            </TableHeader>
                                                            <TableBody items={selectedUserForView.enrolledCourses} emptyContent="No courses found.">
                                                                {(item: any) => (
                                                                    <TableRow key={item.course_code}>
                                                                        <TableCell>{item.course_code}</TableCell>
                                                                        <TableCell>{item.course_name}</TableCell>
                                                                        <TableCell>{item.year}</TableCell>
                                                                        <TableCell>{item.semester}</TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </CardBody>
                                                </Card>
                                            </div>

                                            {/* Score Analysis for Students */}
                                            {selectedUserForView.profile.type === 2 && selectedUserForView.enrolledCourses.length > 0 && (
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-2">Score Analysis</h3>
                                                    <Card>
                                                        <CardBody>
                                                            <ResponsiveContainer width="100%" height={300}>
                                                                <BarChart
                                                                    data={selectedUserForView.courseScores}
                                                                    margin={{
                                                                        top: 5, right: 20, left: -10, bottom: 5,
                                                                    }}
                                                                >
                                                                    <CartesianGrid strokeDasharray="3 3" />
                                                                    <XAxis dataKey="course_code"
                                                                        tick={{ fontSize: 12 }}
                                                                        interval={0}
                                                                    />
                                                                    <YAxis unit="%" />
                                                                    <Tooltip
                                                                        contentStyle={{
                                                                            borderRadius: '0.5rem',
                                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                                            padding: '0.5rem 1rem'
                                                                        }}
                                                                        formatter={(value, name, props) => [`${props.payload.earned}/${props.payload.total} (${value}%)`, "Score"]}
                                                                    />
                                                                    <Legend formatter={(value) => <span className="text-gray-600">{value}</span>}/>
                                                                    <Bar dataKey="percentage" fill="#8884d8" name="Score Percentage"/>
                                                                </BarChart>
                                                            </ResponsiveContainer>
                                                        </CardBody>
                                                    </Card>
                                                </div>
                                            )}

                                            {/* Activity Log */}
                                            <div>
                                                <h3 className="text-xl font-semibold mb-2">Recent Activity</h3>
                                                <Card>
                                                    <CardBody className="p-0">
                                                        <Table removeWrapper aria-label="Activity Log">
                                                            <TableHeader>
                                                                <TableColumn>ACTION</TableColumn>
                                                                <TableColumn>DETAILS</TableColumn>
                                                                <TableColumn>TIMESTAMP</TableColumn>
                                                            </TableHeader>
                                                            <TableBody items={selectedUserForView.activityLogs} emptyContent="No recent activity.">
                                                                {(item: any) => (
                                                                    <TableRow key={item.timestamp}>
                                                                        <TableCell><Chip color="default" variant="flat" size="sm">{item.action}</Chip></TableCell>
                                                                        <TableCell>{item.details}</TableCell>
                                                                        <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </CardBody>
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p>Could not load user details.</p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Edit User Modal */}
            <Modal isOpen={isOpenEdit} onOpenChange={onOpenChangeEdit} placement="top-center">
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleUpdateSubmit}>
                            <ModalHeader className="flex flex-col gap-1">Edit User</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col items-center gap-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleEditImageChange}
                                        className="hidden"
                                        id="edit-image-upload"
                                    />
                                    <label htmlFor="edit-image-upload" className="cursor-pointer">
                                        <Avatar 
                                            src={editPreviewUrl || '/profile-img.png'} 
                                            className="w-24 h-24 text-large" 
                                            isBordered
                                            color="secondary"
                                        />
                                    </label>
                                </div>
                                <Input
                                    autoFocus
                                    label="Full Name"
                                    placeholder="Enter full name"
                                    variant="bordered"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleEditInputChange}
                                />
                                <Input
                                    label="Email"
                                    placeholder="Enter email"
                                    variant="bordered"
                                    name="email"
                                    value={editFormData.email}
                                    onChange={handleEditInputChange}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit">
                                    Save Changes
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </div>
</>
    );
    
}

export default App;
