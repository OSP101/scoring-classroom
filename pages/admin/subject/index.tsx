"use client"
import Head from 'next/head'
import { useState, useEffect } from "react";
import type { SVGProps } from "react";
import type { Selection, ChipProps, SortDescriptor, PaginationItemRenderProps } from "@heroui/react";
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });
import WatermarkOverlay from "@/Components/WatermarkOverlay";
import { useSession, signIn } from "next-auth/react"


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
    Avatar,
    // Select,
    // SelectItem,
} from "@heroui/react";
import Link from "next/link";
import toast from 'react-hot-toast';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
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

export const EditIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => {
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
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
            <path
                d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
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
    { name: "ID", uid: "subject_code", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "YEAR", uid: "year", sortable: true },
    { name: "SEMESTER", uid: "semester", sortable: true },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
    'เปิดใช้งาน': "success",
    'ปิดใช้งาน': "danger",
};

type CourseOffering = {
    id: number; // course_offering.id
    subject_code: string;
    name: string;
    description: string;
    year: number;
    semester: number;
    image: string;
    status: string;
};

type BaseSubject = {
    id: string;
    subject_code: string;
    name: string;
};

const INITIAL_VISIBLE_COLUMNS = ["subject_code", "name", "year", "semester", "status", "actions"];

export default function App() {
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const { isOpen: isViewOpen, onOpen: onViewOpen, onOpenChange: onViewOpenChange } = useDisclosure();
    const { isOpen: isEnrollOpen, onOpen: onEnrollOpen, onOpenChange: onEnrollOpenChange } = useDisclosure();
    const { isOpen: isAddTeacherOpen, onOpen: onAddTeacherOpen, onOpenChange: onAddTeacherOpenChange } = useDisclosure();

    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS),
    );
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "year",
        direction: "descending",
    });

    const [offerings, setOfferings] = useState<CourseOffering[]>([]);
    const [baseSubjects, setBaseSubjects] = useState<BaseSubject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newOfferingData, setNewOfferingData] = useState({
        subjectId: "",
        year: new Date().getFullYear() + 543, // Default to current Buddhist year
        semester: 1,
        image: ""
    });

    const [editingOffering, setEditingOffering] = useState<CourseOffering | null>(null);
    const [editFormData, setEditFormData] = useState({
        year: 0,
        semester: 1,
        image: "",
        status: "o"
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    
    // สำหรับ Add Modal
    const [addImageFile, setAddImageFile] = useState<File | null>(null);
    const [addImagePreview, setAddImagePreview] = useState<string>("");

    const [viewOffering, setViewOffering] = useState<CourseOffering | null>(null);
    const [offeringDetails, setOfferingDetails] = useState<any>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    // สำหรับ Enroll Modal
    const [enrollingOffering, setEnrollingOffering] = useState<CourseOffering | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);

    // สำหรับ Bulk Enroll
    const [bulkEnrollText, setBulkEnrollText] = useState("");
    const [bulkEnrollResults, setBulkEnrollResults] = useState<any[]>([]);
    const [isProcessingBulk, setIsProcessingBulk] = useState(false);
    const [bulkEnrollMode, setBulkEnrollMode] = useState(false);

    // สำหรับ Add Teacher Modal
    const [addingTeacherOffering, setAddingTeacherOffering] = useState<CourseOffering | null>(null);
    const [teacherSearchTerm, setTeacherSearchTerm] = useState("");
    const [teacherSearchResults, setTeacherSearchResults] = useState<any[]>([]);
    const [isSearchingTeachers, setIsSearchingTeachers] = useState(false);
    const [isAddingTeacher, setIsAddingTeacher] = useState(false);

    const fetchOfferings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/v2/admin/subjects", {
                headers: {
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch');

            const formatted = data.map((c: any) => ({
                id: c.id,
                subject_code: c.subject_code,
                name: c.name,
                description: c.description || "No description",
                year: c.year,
                semester: c.semester,
                image: c.image || '/sc363204.png',
                status: c.status === 'o' ? 'เปิดใช้งาน' : 'ปิดใช้งาน',
            }));

            setOfferings(formatted);
        } catch (err) {
            console.error("Failed to fetch course offerings", err);
            toast.error("Failed to load course offerings.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBaseSubjects = async () => {
        try {
            const res = await fetch("/api/v2/admin/base-subjects", {
                headers: {
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch');
            setBaseSubjects(data);
        } catch (error) {
            console.error("Failed to fetch base subjects", error);
            toast.error("Failed to load subject list for dropdown.");
        }
    };


    useEffect(() => {
        fetchOfferings();
        fetchBaseSubjects();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewOfferingData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAddImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAddImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditOffering = (offering: CourseOffering) => {
        setEditingOffering(offering);
        setEditFormData({
            year: offering.year,
            semester: offering.semester,
            image: offering.image,
            status: offering.status === 'เปิดใช้งาน' ? 'o' : 'c'
        });
        setImagePreview("");
        setImageFile(null);
        onEditOpen();
    };

    const handleUpdateOffering = async () => {
        if (!editingOffering) return;

        const toastId = toast.loading('Updating course offering...');

        try {
            // If there's a new image file, upload it first
            let imagePath = editFormData.image;
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                formData.append('courseId', editingOffering.id.toString());

                const uploadRes = await fetch('/api/v2/admin/upload-image', {
                    method: 'POST',
                    headers: {
                        "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                    },
                    body: formData,
                });

                if (uploadRes.ok) {
                    const uploadResult = await uploadRes.json();
                    imagePath = uploadResult.imagePath;
                } else {
                    throw new Error('Failed to upload image');
                }
            }

            // Update the course offering
            const response = await fetch(`/api/v2/admin/course-offerings/${editingOffering.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                },
                body: JSON.stringify({
                    ...editFormData,
                    image: imagePath
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Course offering updated successfully!', { id: toastId });
                onEditOpenChange(); // Close modal
                fetchOfferings(); // Refresh the list
            } else {
                throw new Error(result.message || 'An error occurred');
            }
        } catch (error: any) {
            toast.error(`Error: ${error.message}`, { id: toastId });
        }
    };

    const handleAddOffering = async () => {
        if (!newOfferingData.subjectId || !newOfferingData.year || !newOfferingData.semester) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const toastId = toast.loading('Creating new course offering...');

        try {
            // If there's an image file, upload it first
            let imagePath = "uploads/1750614287730_images-cp.png"; // Default image
            if (addImageFile) {
                const formData = new FormData();
                formData.append('image', addImageFile);
                formData.append('courseId', 'new'); // Temporary ID for new course

                const uploadRes = await fetch('/api/v2/admin/upload-image', {
                    method: 'POST',
                    headers: {
                        "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                    },
                    body: formData,
                });

                if (uploadRes.ok) {
                    const uploadResult = await uploadRes.json();
                    imagePath = uploadResult.imagePath;
                } else {
                    throw new Error('Failed to upload image');
                }
            }

            // Create the course offering
            const response = await fetch('/api/v2/admin/course-offerings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                },
                body: JSON.stringify({
                    ...newOfferingData,
                    image: imagePath
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Course offering created successfully!', { id: toastId });
                onAddOpenChange(); // Close modal
                fetchOfferings(); // Refresh the list
                // Reset form
                setNewOfferingData({
                    subjectId: "",
                    year: new Date().getFullYear() + 543,
                    semester: 1,
                    image: ""
                });
                setAddImageFile(null);
                setAddImagePreview("");
            } else {
                throw new Error(result.message || 'An error occurred');
            }
        } catch (error: any) {
            toast.error(`Error: ${error.message}`, { id: toastId });
        }
    };

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredOfferings = [...offerings];

        if (hasSearchFilter) {
            filteredOfferings = filteredOfferings.filter((offering) =>
                offering.name.toLowerCase().includes(filterValue.toLowerCase()) ||
                offering.subject_code.toLowerCase().includes(filterValue.toLowerCase()) ||
                offering.year.toString().includes(filterValue)
            );
        }

        return filteredOfferings;
    }, [offerings, filterValue]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: CourseOffering, b: CourseOffering) => {
            const column = sortDescriptor.column as keyof CourseOffering;
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

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { data: session } = useSession()

    const handleViewOffering = async (offering: CourseOffering) => {
        setViewOffering(offering);
        setIsLoadingDetails(true);
        setOfferingDetails(null); // Reset details
        onViewOpen();
        
        try {
            const res = await fetch(`/api/v2/admin/course-offerings/${offering.id}/details`, {
                headers: {
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch details');
            setOfferingDetails(data);
        } catch (error) {
            console.error("Failed to fetch offering details", error);
            toast.error("Failed to load course details.");
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleCloseViewModal = () => {
        setViewOffering(null);
        setOfferingDetails(null);
        setIsLoadingDetails(false);
        onViewOpenChange();
    };

    const handleEnrollOffering = (offering: CourseOffering) => {
        setEnrollingOffering(offering);
        setSearchTerm("");
        setSearchResults([]);
        onEnrollOpen();
    };

    const handleSearchStudents = async (search: string) => {
        if (!enrollingOffering || !search.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const res = await fetch(`/api/v2/admin/course-offerings/${enrollingOffering.id}/enroll-student?search=${encodeURIComponent(search)}`, {
                headers: {
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to search students');
            setSearchResults(data);
        } catch (error) {
            console.error("Failed to search students", error);
            toast.error("Failed to search students.");
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleEnrollStudent = async (studentId: string) => {
        if (!enrollingOffering) return;

        setIsEnrolling(true);
        try {
            const res = await fetch(`/api/v2/admin/course-offerings/${enrollingOffering.id}/enroll-student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                },
                body: JSON.stringify({ studentId })
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success(`เพิ่ม ${data.student.name} เข้าวิชาเรียบร้อยแล้ว!`);
                // Refresh the details if view modal is open
                if (viewOffering && viewOffering.id === enrollingOffering.id) {
                    handleViewOffering(viewOffering);
                }
                // Clear search
                setSearchTerm("");
                setSearchResults([]);
            } else {
                throw new Error(data.message || 'Failed to enroll student');
            }
        } catch (error: any) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleCloseEnrollModal = () => {
        setEnrollingOffering(null);
        setSearchTerm("");
        setSearchResults([]);
        setIsSearching(false);
        setIsEnrolling(false);
        setBulkEnrollMode(false);
        setBulkEnrollText("");
        setBulkEnrollResults([]);
        onEnrollOpenChange();
    };

    const handleAddTeacherOffering = (offering: CourseOffering) => {
        setAddingTeacherOffering(offering);
        setTeacherSearchTerm("");
        setTeacherSearchResults([]);
        onAddTeacherOpen();
    };

    const handleSearchTeachers = async (search: string) => {
        if (!addingTeacherOffering || !search.trim()) {
            setTeacherSearchResults([]);
            return;
        }

        setIsSearchingTeachers(true);
        try {
            const res = await fetch(`/api/v2/admin/course-offerings/${addingTeacherOffering.id}/add-teacher?search=${encodeURIComponent(search)}`, {
                headers: {
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to search teachers');
            setTeacherSearchResults(data);
        } catch (error) {
            console.error("Failed to search teachers", error);
            toast.error("Failed to search teachers.");
            setTeacherSearchResults([]);
        } finally {
            setIsSearchingTeachers(false);
        }
    };

    const handleAddTeacher = async (teacherId: string) => {
        if (!addingTeacherOffering) return;

        setIsAddingTeacher(true);
        try {
            const res = await fetch(`/api/v2/admin/course-offerings/${addingTeacherOffering.id}/add-teacher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                },
                body: JSON.stringify({ teacherId })
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success(`เพิ่ม ${data.teacher.name} เป็นผู้สอนเรียบร้อยแล้ว!`);
                // Refresh the details if view modal is open
                if (viewOffering && viewOffering.id === addingTeacherOffering.id) {
                    handleViewOffering(viewOffering);
                }
                // Clear search
                setTeacherSearchTerm("");
                setTeacherSearchResults([]);
            } else {
                throw new Error(data.message || 'Failed to add teacher');
            }
        } catch (error: any) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsAddingTeacher(false);
        }
    };

    const handleCloseAddTeacherModal = () => {
        setAddingTeacherOffering(null);
        setTeacherSearchTerm("");
        setTeacherSearchResults([]);
        setIsSearchingTeachers(false);
        setIsAddingTeacher(false);
        onAddTeacherOpenChange();
    };

    const renderCell = React.useCallback((offering: CourseOffering, columnKey: React.Key) => {
        const cellValue = offering[columnKey as keyof CourseOffering];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "sm", src: `/${offering.image}` }}
                        description={offering.description}
                        name={cellValue}
                    >
                        {offering.name}
                    </User>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[offering.status]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
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
                                <DropdownItem key="view" onPress={() => handleViewOffering(offering)}>
                                    View
                                </DropdownItem>
                                <DropdownItem key="edit" onPress={() => handleEditOffering(offering)}>
                                    Edit
                                </DropdownItem>
                                <DropdownItem key="enroll" onPress={() => handleEnrollOffering(offering)}>
                                    Add Student
                                </DropdownItem>
                                <DropdownItem key="addTeacher" onPress={() => handleAddTeacherOffering(offering)}>
                                    Add Teacher
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
                        placeholder="Search by name, ID, or year..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
                        <Button className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white" endContent={<PlusIcon />} onPress={onAddOpen}>
                            Add New Offering
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {offerings.length} offerings</span>
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
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        offerings.length,
        hasSearchFilter,
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
    }, [selectedKeys, items.length, page, pages, hasSearchFilter, onPreviousPage, onNextPage]);

    const processBulkEnrollText = async () => {
        if (!enrollingOffering || !bulkEnrollText.trim()) {
            toast.error("กรุณาใส่ข้อมูลที่ต้องการเพิ่ม");
            return;
        }

        setIsProcessingBulk(true);
        try {
            // แยกข้อมูลตามบรรทัด
            const lines = bulkEnrollText.trim().split('\n').filter(line => line.trim());
            const studentIds: string[] = [];

            // ประมวลผลแต่ละบรรทัด
            for (const line of lines) {
                // ลบช่องว่างและแยกข้อมูล
                const cleanLine = line.trim();
                if (!cleanLine) continue;

                // ลองหารหัสนักศึกษาจากรูปแบบต่างๆ
                let studentId = '';
                
                // รูปแบบ: รหัสนักศึกษา (เช่น 653380001-1)
                const idMatch = cleanLine.match(/\d{9}-\d/);
                if (idMatch) {
                    studentId = idMatch[0];
                } else {
                    // ถ้าไม่มีรูปแบบที่ชัดเจน ให้ใช้ข้อมูลทั้งหมด
                    studentId = cleanLine;
                }

                if (studentId && !studentIds.includes(studentId)) {
                    studentIds.push(studentId);
                }
            }

            if (studentIds.length === 0) {
                toast.error("ไม่พบรหัสนักศึกษาที่ถูกต้อง");
                return;
            }

            // ค้นหาข้อมูลนักศึกษา
            const foundStudents: any[] = [];
            const notFoundStudents: string[] = [];

            for (const studentId of studentIds) {
                try {
                    const res = await fetch(`/api/v2/admin/course-offerings/${enrollingOffering.id}/enroll-student?search=${encodeURIComponent(studentId)}`, {
                        headers: {
                            "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                        }
                    });
                    const data = await res.json();
                    
                    if (res.ok && data.length > 0) {
                        // หานักศึกษาที่ตรงกับรหัสที่ใส่
                        const student = data.find((s: any) => s.stdid === studentId);
                        if (student) {
                            foundStudents.push(student);
                        } else {
                            notFoundStudents.push(studentId);
                        }
                    } else {
                        notFoundStudents.push(studentId);
                    }
                } catch (error) {
                    notFoundStudents.push(studentId);
                }
            }

            setBulkEnrollResults(foundStudents);

            if (notFoundStudents.length > 0) {
                toast.error(`ไม่พบนักศึกษา ${notFoundStudents.length} คน: ${notFoundStudents.join(', ')}`);
            }

            if (foundStudents.length > 0) {
                toast.success(`พบนักศึกษา ${foundStudents.length} คนที่สามารถเพิ่มได้`);
            }

        } catch (error) {
            console.error("Error processing bulk enroll text:", error);
            toast.error("เกิดข้อผิดพลาดในการประมวลผลข้อมูล");
        } finally {
            setIsProcessingBulk(false);
        }
    };

    const handleBulkEnrollStudents = async () => {
        if (!enrollingOffering || bulkEnrollResults.length === 0) return;

        setIsEnrolling(true);
        let successCount = 0;
        let errorCount = 0;

        for (const student of bulkEnrollResults) {
            try {
                const res = await fetch(`/api/v2/admin/course-offerings/${enrollingOffering.id}/enroll-student`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                    },
                    body: JSON.stringify({ studentId: student.stdid })
                });
                
                if (res.ok) {
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (error) {
                errorCount++;
            }
        }

        if (successCount > 0) {
            toast.success(`เพิ่มนักศึกษา ${successCount} คนเรียบร้อยแล้ว!`);
        }
        
        if (errorCount > 0) {
            toast.error(`ไม่สามารถเพิ่มนักศึกษา ${errorCount} คน`);
        }

        // Refresh the details if view modal is open
        if (viewOffering && viewOffering.id === enrollingOffering.id) {
            handleViewOffering(viewOffering);
        }

        // Clear bulk enroll data
        setBulkEnrollText("");
        setBulkEnrollResults([]);
        setBulkEnrollMode(false);
        setIsEnrolling(false);
    };

    return (
        <>
        <Head>
            <title>Admin Subject | Scoring Classroom</title>
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
                            <Link href={`/admin/users`} className="flex items-center p-2 pl-4 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm group">
                                <span className={`ms-3 ${kanit.className}`}>Users</span>
                            </Link>

                        </li>
                        <li>
                            <Link href={`/admin/subject`} className="flex items-center p-2 pl-4 rounded-lg bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white text-sm group">
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
                    <TableHeader columns={headerColumns}>
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
                    <TableBody emptyContent={"No course offerings found"} items={sortedItems} isLoading={isLoading} loadingContent={<Spinner label="Loading..." color="danger" variant="wave" />}>
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add New Offering Modal */}
            <Modal isOpen={isAddOpen} onOpenChange={onAddOpenChange} placement="top-center" size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add New Course Offering</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-6">
                                    {/* Image Upload Section */}
                                    <div className="flex flex-col gap-4">
                                        <label className="text-sm font-medium">Course Image</label>
                                        <div className="flex items-center gap-4">
                                            <Avatar
                                                src={addImagePreview || "/uploads/1750614287730_images-cp.png"}
                                                className="w-20 h-20 text-large"
                                                showFallback
                                                name="Course"
                                            />
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAddImageChange}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] file:text-white hover:file:opacity-80"
                                                />
                                                <p className="text-xs text-gray-500">
                                                    Recommended: Square image, max 2MB. Leave empty to use default image.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <label htmlFor="subjectId" className="text-sm font-medium">Base Subject *</label>
                                        <select
                                            id="subjectId"
                                            name="subjectId"
                                            required
                                            value={newOfferingData.subjectId}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-xl bg-default-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        >
                                            <option value="" disabled>Select a subject</option>
                                            {baseSubjects.map((subject) => (
                                                <option key={subject.id} value={subject.id}>
                                                    {`${subject.subject_code} - ${subject.name}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            isRequired
                                            label="Year"
                                            name="year"
                                            placeholder="Enter academic year (e.g., 2567)"
                                            type="number"
                                            value={String(newOfferingData.year)}
                                            onChange={handleInputChange}
                                            variant="bordered"
                                        />
                                        
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="semester" className="text-sm font-medium">Semester *</label>
                                            <select
                                                id="semester"
                                                name="semester"
                                                required
                                                value={newOfferingData.semester}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded-xl bg-default-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">Summer</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Close
                                </Button>
                                <Button className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white" onPress={handleAddOffering}>
                                    Create Offering
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Edit Offering Modal */}
            <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} placement="top-center" size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Edit Course Offering
                                {editingOffering && (
                                    <p className="text-sm text-gray-500">
                                        {editingOffering.subject_code} - {editingOffering.name}
                                    </p>
                                )}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-6">
                                    {/* Image Upload Section */}
                                    <div className="flex flex-col gap-4">
                                        <label className="text-sm font-medium">Course Image</label>
                                        <div className="flex items-center gap-4">
                                            <Avatar
                                                src={imagePreview || (editingOffering ? `/${editingOffering.image}` : "")}
                                                className="w-20 h-20 text-large"
                                                showFallback
                                                name={editingOffering?.name || "Course"}
                                            />
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] file:text-white hover:file:opacity-80"
                                                />
                                                <p className="text-xs text-gray-500">
                                                    Recommended: Square image, max 2MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            isRequired
                                            label="Academic Year"
                                            name="year"
                                            placeholder="e.g., 2567"
                                            type="number"
                                            value={String(editFormData.year)}
                                            onChange={handleEditInputChange}
                                            variant="bordered"
                                        />
                                        
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="editSemester" className="text-sm font-medium">Semester *</label>
                                            <select
                                                id="editSemester"
                                                name="semester"
                                                required
                                                value={editFormData.semester}
                                                onChange={handleEditInputChange}
                                                className="w-full p-2 border rounded-xl bg-default-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">Summer</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="editStatus" className="text-sm font-medium">Status</label>
                                        <select
                                            id="editStatus"
                                            name="status"
                                            value={editFormData.status}
                                            onChange={handleEditInputChange}
                                            className="w-full p-2 border rounded-xl bg-default-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        >
                                            <option value="o">เปิดใช้งาน</option>
                                            <option value="c">ปิดใช้งาน</option>
                                        </select>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white" onPress={handleUpdateOffering}>
                                    Update Offering
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* View Offering Modal */}
            <Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange} placement="top-center" size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 items-center bg-gradient-to-tr from-[#FF1CF7]/20 to-[#b249f8]/20 rounded-t-2xl">
                                <span className="text-2xl font-bold flex items-center gap-2">
                                    <span role="img" aria-label="book">📚</span> Course Offering Details
                                </span>
                                {viewOffering && (
                                    <p className="text-base text-gray-500 mt-1">
                                        <span className="font-semibold">{viewOffering.subject_code}</span> - {viewOffering.name}
                                    </p>
                                )}
                            </ModalHeader>
                            <ModalBody className="bg-white dark:bg-gray-900 rounded-b-2xl max-h-[70vh] overflow-y-auto">
                                {viewOffering && (
                                    <div className="flex flex-col gap-6">
                                        {/* Course Basic Info */}
                                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start p-2 md:p-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <Avatar
                                                    src={`/${viewOffering.image}`}
                                                    className="w-36 h-36 text-large shadow-lg border-4 border-pink-200 dark:border-pink-400"
                                                    showFallback
                                                    name={viewOffering.name}
                                                />
                                                <Chip color={statusColorMap[viewOffering.status]} size="md" variant="solid" className="mt-2 text-base px-4 py-1">
                                                    {viewOffering.status}
                                                </Chip>
                                            </div>
                                            <div className="flex-1 w-full max-w-xl">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-gray-500 text-sm">รหัสวิชา</span>
                                                        <span className="font-semibold text-lg">{viewOffering.subject_code}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-gray-500 text-sm">ชื่อวิชา</span>
                                                        <span className="font-semibold text-lg">{viewOffering.name}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-gray-500 text-sm">ปีการศึกษา</span>
                                                        <span className="font-semibold text-lg">{viewOffering.year}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-gray-500 text-sm">ภาคเรียน</span>
                                                        <span className="font-semibold text-lg">{viewOffering.semester === 3 ? 'Summer' : viewOffering.semester}</span>
                                                    </div>
                                                </div>
                                                <div className="my-4 border-t border-dashed border-gray-300 dark:border-gray-700" />
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-gray-500 text-sm">รายละเอียด</span>
                                                    <span className="text-base text-gray-700 dark:text-gray-200 whitespace-pre-line">{viewOffering.description}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Statistics Cards */}
                                        {offeringDetails && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-500 rounded-lg">
                                                            <span className="text-white text-xl">👥</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-blue-600 dark:text-blue-400">นักศึกษาลงทะเบียน</p>
                                                            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                                                                {offeringDetails.statistics.studentCount} คน
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-green-500 rounded-lg">
                                                            <span className="text-white text-xl">👨‍🏫</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-green-600 dark:text-green-400">ผู้สอน/ผู้ช่วยสอน</p>
                                                            <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                                                                {offeringDetails.statistics.teacherCount} คน
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Loading State */}
                                        {isLoadingDetails && (
                                            <div className="flex justify-center items-center py-8">
                                                <Spinner label="กำลังโหลดข้อมูล..." color="danger" variant="wave" />
                                            </div>
                                        )}

                                        {/* Enrolled Students Section */}
                                        {offeringDetails && !isLoadingDetails && (
                                            <div className="space-y-4">
                                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                        <span role="img" aria-label="students">👥</span>
                                                        นักศึกษาลงทะเบียน ({offeringDetails.enrolledStudents.length} คน)
                                                    </h3>
                                                    {offeringDetails.enrolledStudents.length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                                                            {offeringDetails.enrolledStudents.map((student: any) => (
                                                                <div key={student.stdid} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                    <Avatar
                                                                        src={student.image ? `${student.image}` : undefined}
                                                                        className="w-8 h-8"
                                                                        showFallback
                                                                        name={student.name}
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                            {student.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                            {student.stdid}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                                            <span role="img" aria-label="no students" className="text-3xl mb-2 block">📭</span>
                                                            <p>ยังไม่มีนักศึกษาลงทะเบียน</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Teachers Section */}
                                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                        <span role="img" aria-label="teachers">👨‍🏫</span>
                                                        ผู้สอน/ผู้ช่วยสอน ({offeringDetails.teachers.length} คน)
                                                    </h3>
                                                    {offeringDetails.teachers.length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                                                            {offeringDetails.teachers.map((teacher: any) => (
                                                                <div key={teacher.stdid} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                                                    <Avatar
                                                                        src={teacher.image ? `${teacher.image}` : undefined}
                                                                        className="w-8 h-8"
                                                                        showFallback
                                                                        name={teacher.name}
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                            {teacher.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                            {teacher.stdid}
                                                                        </p>
                                                                        <p className="text-xs text-blue-600 dark:text-blue-400">
                                                                            {teacher.type === 1 ? 'อาจารย์' : teacher.type === 2 ? 'ผู้ช่วยสอน' : 'ผู้ดูแล'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                                            <span role="img" aria-label="no teachers" className="text-3xl mb-2 block">👨‍🏫</span>
                                                            <p>ยังไม่มีผู้สอน/ผู้ช่วยสอน</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter className="bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
                                <Button color="danger" variant="flat" onPress={handleCloseViewModal}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Enroll Student Modal */}
            <Modal isOpen={isEnrollOpen} onOpenChange={onEnrollOpenChange} placement="top-center" size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 items-center bg-gradient-to-tr from-[#FF1CF7]/20 to-[#b249f8]/20 rounded-t-2xl">
                                <span className="text-xl font-bold flex items-center gap-2">
                                    <span role="img" aria-label="add student">👨‍🎓</span> เพิ่มนักศึกษาเข้าวิชา
                                </span>
                                {enrollingOffering && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        <span className="font-semibold">{enrollingOffering.subject_code}</span> - {enrollingOffering.name}
                                    </p>
                                )}
                            </ModalHeader>
                            <ModalBody className="bg-white dark:bg-gray-900 rounded-b-2xl">
                                {enrollingOffering && (
                                    <div className="flex flex-col gap-6">
                                        {/* Mode Toggle */}
                                        <div className="flex gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <Button
                                                size="sm"
                                                variant={!bulkEnrollMode ? "solid" : "light"}
                                                color={!bulkEnrollMode ? "primary" : "default"}
                                                onPress={() => setBulkEnrollMode(false)}
                                            >
                                                ค้นหาแบบเดียว
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={bulkEnrollMode ? "solid" : "light"}
                                                color={bulkEnrollMode ? "primary" : "default"}
                                                onPress={() => setBulkEnrollMode(true)}
                                            >
                                                เพิ่มหลายคน
                                            </Button>
                                        </div>

                                        {!bulkEnrollMode ? (
                                            <>
                                                {/* Search Section */}
                                                <div className="flex flex-col gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                                            ค้นหานักศึกษา
                                                        </label>
                                                        <Input
                                                            placeholder="กรอกชื่อ, รหัสนักศึกษา หรืออีเมล..."
                                                            value={searchTerm}
                                                            onChange={(e) => {
                                                                setSearchTerm(e.target.value);
                                                                if (e.target.value.trim()) {
                                                                    // Debounce search
                                                                    const timeoutId = setTimeout(() => {
                                                                        handleSearchStudents(e.target.value);
                                                                    }, 300);
                                                                    return () => clearTimeout(timeoutId);
                                                                } else {
                                                                    setSearchResults([]);
                                                                }
                                                            }}
                                                            startContent={<SearchIcon />}
                                                            endContent={isSearching && <Spinner size="sm" />}
                                                            variant="bordered"
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            ค้นหาด้วยชื่อ, รหัสนักศึกษา หรืออีเมล (แสดงเฉพาะนักศึกษาที่ยังไม่ได้ลงทะเบียนในวิชานี้)
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Search Results */}
                                                {searchResults.length > 0 && (
                                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                                            ผลการค้นหา ({searchResults.length} คน)
                                                        </h3>
                                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                                            {searchResults.map((student) => (
                                                                <div key={student.stdid} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                    <div className="flex items-center gap-3">
                                                                        <Avatar
                                                                            src={student.image ? `${student.image}` : undefined}
                                                                            className="w-10 h-10"
                                                                            showFallback
                                                                            name={student.name}
                                                                        />
                                                                        <div>
                                                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                                                {student.name}
                                                                            </p>
                                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                                {student.stdid}
                                                                            </p>
                                                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                                                {student.email}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <Button
                                                                        size="sm"
                                                                        color="primary"
                                                                        variant="flat"
                                                                        onPress={() => handleEnrollStudent(student.stdid)}
                                                                        isLoading={isEnrolling}
                                                                        disabled={isEnrolling}
                                                                    >
                                                                        เพิ่ม
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* No Results */}
                                                {searchTerm && !isSearching && searchResults.length === 0 && (
                                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                        <span role="img" aria-label="no results" className="text-3xl mb-2 block">🔍</span>
                                                        <p>ไม่พบนักศึกษาที่ตรงกับคำค้นหา</p>
                                                        <p className="text-sm">หรือนักศึกษาอาจลงทะเบียนในวิชานี้แล้ว</p>
                                                    </div>
                                                )}

                                                {/* Instructions */}
                                                {!searchTerm && (
                                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                        <span role="img" aria-label="search" className="text-3xl mb-2 block">🔍</span>
                                                        <p>กรอกคำค้นหาเพื่อหานักศึกษาที่ต้องการเพิ่ม</p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {/* Bulk Enroll Section */}
                                                <div className="flex flex-col gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                                            คัดลอกข้อมูลจาก Excel
                                                        </label>
                                                        <textarea
                                                            placeholder="วางข้อมูลจาก Excel ที่นี่...&#10;ตัวอย่าง:&#10;653380001-1&#10;653380002-9&#10;653380003-7"
                                                            value={bulkEnrollText}
                                                            onChange={(e) => setBulkEnrollText(e.target.value)}
                                                            className="w-full p-3 border rounded-lg bg-default-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-32 resize-vertical"
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            คัดลอกข้อมูลจาก Excel แล้ววางที่นี่ (หนึ่งรหัสนักศึกษาต่อหนึ่งบรรทัด)
                                                        </p>
                                                    </div>
                                                    
                                                    <Button
                                                        color="primary"
                                                        variant="flat"
                                                        onPress={processBulkEnrollText}
                                                        isLoading={isProcessingBulk}
                                                        disabled={!bulkEnrollText.trim() || isProcessingBulk}
                                                        className="self-start"
                                                    >
                                                        ประมวลผลข้อมูล
                                                    </Button>
                                                </div>

                                                {/* Bulk Results */}
                                                {bulkEnrollResults.length > 0 && (
                                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                                นักศึกษาที่พบ ({bulkEnrollResults.length} คน)
                                                            </h3>
                                                            <Button
                                                                size="sm"
                                                                color="success"
                                                                variant="flat"
                                                                onPress={handleBulkEnrollStudents}
                                                                isLoading={isEnrolling}
                                                                disabled={isEnrolling}
                                                            >
                                                                เพิ่มทั้งหมด
                                                            </Button>
                                                        </div>
                                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                                            {bulkEnrollResults.map((student) => (
                                                                <div key={student.stdid} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                                                                    <div className="flex items-center gap-3">
                                                                        <Avatar
                                                                            src={student.image ? `${student.image}` : undefined}
                                                                            className="w-10 h-10"
                                                                            showFallback
                                                                            name={student.name}
                                                                        />
                                                                        <div>
                                                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                                                {student.name}
                                                                            </p>
                                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                                {student.stdid}
                                                                            </p>
                                                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                                                {student.email}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <Chip color="success" size="sm" variant="flat">
                                                                        พร้อมเพิ่ม
                                                                    </Chip>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Instructions for Bulk */}
                                                {!bulkEnrollText && (
                                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                        <span role="img" aria-label="excel" className="text-3xl mb-2 block">📊</span>
                                                        <p>คัดลอกข้อมูลจาก Excel แล้ววางที่นี่</p>
                                                        <p className="text-sm">ระบบจะประมวลผลและหานักศึกษาที่ตรงกับรหัสที่ใส่</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter className="bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
                                <Button color="danger" variant="flat" onPress={handleCloseEnrollModal}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Add Teacher Modal */}
            <Modal isOpen={isAddTeacherOpen} onOpenChange={onAddTeacherOpenChange} placement="top-center" size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 items-center bg-gradient-to-tr from-[#FF1CF7]/20 to-[#b249f8]/20 rounded-t-2xl">
                                <span className="text-xl font-bold flex items-center gap-2">
                                    <span role="img" aria-label="add teacher">👨‍🏫</span> เพิ่มผู้สอน/ผู้ช่วยสอน
                                </span>
                                {addingTeacherOffering && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        <span className="font-semibold">{addingTeacherOffering.subject_code}</span> - {addingTeacherOffering.name}
                                    </p>
                                )}
                            </ModalHeader>
                            <ModalBody className="bg-white dark:bg-gray-900 rounded-b-2xl">
                                {addingTeacherOffering && (
                                    <div className="flex flex-col gap-6">
                                        {/* Search Section */}
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                                    ค้นหาผู้สอน/ผู้ช่วยสอน
                                                </label>
                                                <Input
                                                    placeholder="กรอกชื่อ, รหัส หรืออีเมล..."
                                                    value={teacherSearchTerm}
                                                    onChange={(e) => {
                                                        setTeacherSearchTerm(e.target.value);
                                                        if (e.target.value.trim()) {
                                                            // Debounce search
                                                            const timeoutId = setTimeout(() => {
                                                                handleSearchTeachers(e.target.value);
                                                            }, 300);
                                                            return () => clearTimeout(timeoutId);
                                                        } else {
                                                            setTeacherSearchResults([]);
                                                        }
                                                    }}
                                                    startContent={<SearchIcon />}
                                                    endContent={isSearchingTeachers && <Spinner size="sm" />}
                                                    variant="bordered"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    ค้นหาด้วยชื่อ, รหัส หรืออีเมล (แสดงเฉพาะผู้สอน/ผู้ช่วยสอนที่ยังไม่ได้ถูกมอบหมายในวิชานี้)
                                                </p>
                                            </div>
                                        </div>

                                        {/* Search Results */}
                                        {teacherSearchResults.length > 0 && (
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                                    ผลการค้นหา ({teacherSearchResults.length} คน)
                                                </h3>
                                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                                    {teacherSearchResults.map((teacher) => (
                                                        <div key={teacher.stdid} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar
                                                                    src={teacher.image ? `${teacher.image}` : undefined}
                                                                    className="w-10 h-10"
                                                                    showFallback
                                                                    name={teacher.name}
                                                                />
                                                                <div>
                                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {teacher.name}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {teacher.stdid}
                                                                    </p>
                                                                    <p className="text-xs text-blue-600 dark:text-blue-400">
                                                                        {teacher.type === 1 ? 'อาจารย์' : teacher.type === 3 ? 'ผู้ช่วยสอน' : 'ผู้ดูแล'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                size="sm"
                                                                color="primary"
                                                                variant="flat"
                                                                onPress={() => handleAddTeacher(teacher.stdid)}
                                                                isLoading={isAddingTeacher}
                                                                disabled={isAddingTeacher}
                                                            >
                                                                เพิ่ม
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* No Results */}
                                        {teacherSearchTerm && !isSearchingTeachers && teacherSearchResults.length === 0 && (
                                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                <span role="img" aria-label="no results" className="text-3xl mb-2 block">🔍</span>
                                                <p>ไม่พบผู้สอน/ผู้ช่วยสอนที่ตรงกับคำค้นหา</p>
                                                <p className="text-sm">หรือผู้สอน/ผู้ช่วยสอนอาจถูกมอบหมายในวิชานี้แล้ว</p>
                                            </div>
                                        )}

                                        {/* Instructions */}
                                        {!teacherSearchTerm && (
                                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                <span role="img" aria-label="search" className="text-3xl mb-2 block">🔍</span>
                                                <p>กรอกคำค้นหาเพื่อหาผู้สอน/ผู้ช่วยสอนที่ต้องการเพิ่ม</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter className="bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
                                <Button color="danger" variant="flat" onPress={handleCloseAddTeacherModal}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
        </>
    );
}
