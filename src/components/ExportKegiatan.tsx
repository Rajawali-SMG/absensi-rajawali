import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import Button from "@/components/ui/Button";
import { api } from "@/trpc/react";
import useToastError from "../utils/useToastError";
import CustomSelect from "./CustomSelect";

export default function ExportKegiatan() {
    const [mounted, setMounted] = useState(false);
    const [kelompokIdParam, setKelompokIdParam] = useState("");
    const [eventIdParam, setEventIdParam] = useState("");
    const [openModal, setOpenModal] = useState(false);

    // Mencegah Hydration Error pada Next.js
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch Master Data
    const {
        data: kelompokData,
        error: kelompokError,
        isLoading: kelompokIsLoading,
    } = api.kelompok.getAll.useQuery();

    const { data: eventData, error: eventError } = api.event.getAll.useQuery();

    // Query Export dengan parameter yang reaktif terhadap state
    const { refetch } = api.presence.exportPresence.useQuery(
        {
            eventId: eventIdParam,
            kelompokId: kelompokIdParam,
        },
        {
            enabled: false,
        },
    );

    const handleExport = async () => {
        if (!eventIdParam) {
            toast.error("Silakan pilih event terlebih dahulu!");
            return;
        }

        const { data: presenceData, isError, error } = await refetch();

        if (isError) {
            toast.error(error?.message || "Gagal mengambil data");
            return;
        }

        if (!presenceData?.data?.data || presenceData.data.data.length === 0) {
            toast.error("Data tidak ditemukan untuk filter ini");
            return;
        }

        setOpenModal(false);

        // Identifikasi Kelompok untuk Header/Nama File
        const selectedKelompok = kelompokData?.data.find(k => k.id === kelompokIdParam);
        const labelKelompok = selectedKelompok ? selectedKelompok.nama : "Semua Kelompok";

        // MAPPING DATA KE EXCEL
        const formattedData = presenceData.data.data.map((item: any) => ({
            "Kelompok": labelKelompok,
            "Nama Generus": item.generusName || "-", // FIX: Menggunakan generusName
            "Status": item.status,
            "Keterangan": item.keterangan || "-",
            "Waktu Absen": item.createdAt ? new Date(item.createdAt).toLocaleString("id-ID") : "-",
        }));

        // DATA REKAPITULASI (Sheet 2)
        const rekapRows = [
            { Rekap: "Hadir", Jumlah: presenceData.data.hadir, Persentase: `${presenceData.data.percentage.hadir}%` },
            { Rekap: "Izin", Jumlah: presenceData.data.izin, Persentase: `${presenceData.data.percentage.izin}%` },
            { Rekap: "Alpha", Jumlah: presenceData.data.alpha, Persentase: `${presenceData.data.percentage.alpha}%` },
            { Rekap: "Total", Jumlah: presenceData.data.total, Persentase: "100%" },
        ];

        // PROSES GENERATE EXCEL
        const workbook = XLSX.utils.book_new();
        const wsData = XLSX.utils.json_to_sheet(formattedData);
        const wsRekap = XLSX.utils.json_to_sheet(rekapRows);

        XLSX.utils.book_append_sheet(workbook, wsData, "Data Absensi");
        XLSX.utils.book_append_sheet(workbook, wsRekap, "Rekapitulasi");

        const eventTitle = eventData?.data.find(e => e.id === eventIdParam)?.title || "Export";
        XLSX.writeFile(workbook, `Absensi_${eventTitle}_${labelKelompok.replace(/\s/g, '_')}.xlsx`);

        toast.success("Excel berhasil didownload!");
        
        // Reset state setelah export
        setKelompokIdParam("");
        setEventIdParam("");
    };

    const kelompokOptions = kelompokData?.data.map((item) => ({
        label: item.nama,
        value: item.id,
    })) || [];

    const eventOptions = eventData?.data.map((item) => ({
        label: item.title,
        value: item.id,
    })) || [];

    useToastError(kelompokError);
    useToastError(eventError);

    return (
        <>
            <Button onClick={() => setOpenModal(true)} type="button">
                Export Excel
            </Button>

            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300 ${
                    openModal ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            >
                <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
                    <h2 className="font-bold text-xl mb-6 text-gray-800">Filter Export</h2>
                    
                    {mounted ? (
                        <div className="flex flex-col gap-y-4">
                            <CustomSelect
                                isLoading={kelompokIsLoading}
                                label="Pilih Kelompok (Opsional)"
                                onChange={(e) => setKelompokIdParam(e?.value || "")}
                                options={kelompokOptions}
                                placeholder="Semua Kelompok"
                                isClearable
                                value={kelompokOptions.find(o => o.value === kelompokIdParam) || null}
                            />
                            <CustomSelect
                                isLoading={kelompokIsLoading}
                                label="Pilih Kegiatan/Event (Wajib)"
                                onChange={(e) => setEventIdParam(e?.value || "")}
                                options={eventOptions}
                                placeholder="Pilih Event"
                                value={eventOptions.find(o => o.value === eventIdParam) || null}
                            />
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-gray-400">
                            Memuat data...
                        </div>
                    )}

                    <div className="flex justify-end gap-x-3 mt-8">
                        <Button variant="secondary" onClick={() => setOpenModal(false)}>
                            Batal
                        </Button>
                        <Button 
                            disabled={!eventIdParam} 
                            onClick={handleExport}
                        >
                            Download Excel
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}