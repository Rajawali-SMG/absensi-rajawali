"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CustomSelect from "@/components/CustomSelect";
import TextError from "@/components/TextError";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import {
	jenisKelaminOptions,
	jenjangOptions,
	keteranganOptions,
	pendidikanTerakhirOptions,
	sambungOptions,
} from "@/constants/generus";
import { api } from "@/trpc/react";
import {
	defaultGenerus,
	generusCreateSchema,
	type JenisKelaminType,
	type JenjangType,
	type KeteranganType,
	type PendidikanTerakhirType,
	type SambungType,
} from "@/types/generus";
import useToastError from "@/utils/useToastError";

export default function GenerusCreatePage() {
	const { data, isPending, error } = api.kelompok.getAll.useQuery();
	const router = useRouter();
	const utils = api.useUtils();

	const {
		mutateAsync,
		data: createData,
		error: createError,
	} = api.generus.createGenerus.useMutation({
		onSuccess: () => {
			utils.generus.getAllPaginated.invalidate();
			router.push("/admin/generus");
		},
	});

	const kelompokOptions =
		data?.data.map((item) => ({
			label: item.nama,
			value: item.id,
		})) || [];

	const form = useForm({
		defaultValues: defaultGenerus,
		onSubmit: ({ value }) => {
			toast.promise(mutateAsync(value), {
				error: createError?.message,
				loading: "Loading...",
				success: createData?.message,
			});
		},
		validators: {
			onSubmit: generusCreateSchema,
		},
	});

	useToastError(error);

	return (
		<div className="w-full">
			<h1 className="font-bold mb-6 text-gray-800">Buat Data Generus</h1>

			<form
				className="space-y-4"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div className="space-y-4">
					<form.Field name="nama">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Nama"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									type="text"
									value={field.state.value}
									variant="secondary"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="jenisKelamin">
						{(field) => (
							<div className="space-y-1">
								<Select
									id="jenis_kelamin"
									label="Jenis Kelamin"
									onChange={(e) =>
										field.handleChange(e.target.value as JenisKelaminType)
									}
									options={jenisKelaminOptions}
									placeholder="Pilih Jenis Kelamin"
									value={field.state.value}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="tempatLahir">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Tempat Lahir"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Kota Semarang"
									type="text"
									value={field.state.value}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="tanggalLahir">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Tanggal Lahir"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="2000-01-01"
									type="date"
									value={field.state.value}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="jenjang">
						{(field) => (
							<div className="space-y-1">
								<Select
									id="jenjang"
									label="Jenjang"
									onChange={(e) =>
										field.handleChange(e.target.value as JenjangType)
									}
									options={jenjangOptions}
									placeholder="Pilih Jenjang"
									value={field.state.value}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="nomerWhatsapp">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Nomor WhatsApp"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="+628123456789"
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="pendidikanTerakhir">
						{(field) => (
							<div className="space-y-1">
								<Select
									id="pendidikan_terakhir"
									label="Pendidikan Terakhir"
									onChange={(e) =>
										field.handleChange(e.target.value as PendidikanTerakhirType)
									}
									options={pendidikanTerakhirOptions}
									placeholder="Pilih Pendidikan Terakhir"
									value={field.state.value}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="namaOrangTua">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Nama Orang Tua"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="nomerWhatsappOrangTua">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Nomor WhatsApp Orang Tua"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="+628123456789"
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="sambung">
						{(field) => (
							<div className="space-y-1">
								<Select
									id="sambung"
									label="Sambung"
									onChange={(e) =>
										field.handleChange(e.target.value as SambungType)
									}
									options={sambungOptions}
									placeholder="Pilih Sambung"
									value={field.state.value}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="alamatTempatTinggal">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Alamat Tempat Tinggal"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Jl. Madukoro No. 1"
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="keterangan">
						{(field) => (
							<div className="space-y-1">
								<Select
									id="keterangan"
									label="Keterangan"
									onChange={(e) =>
										field.handleChange(e.target.value as KeteranganType)
									}
									options={keteranganOptions}
									placeholder="Pilih Keterangan"
									value={field.state.value}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="alamatAsal">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Alamat Asal"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Jl. Madukoro No. 1"
									required={false}
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="kelompokId">
						{(field) => (
							<div className="space-y-1">
								<CustomSelect
									isDisabled={isPending}
									label="Kelompok"
									onChange={(e) => field.handleChange(e?.value || "")}
									options={kelompokOptions}
									placeholder="Pilih Kelompok"
									value={kelompokOptions.find(
										(option) => option.value === field.state.value,
									)}
								/>
							</div>
						)}
					</form.Field>
				</div>

				<div className="flex justify-end space-x-4 mt-6">
					<Link href="/admin/generus">Close</Link>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button disabled={!canSubmit} type="submit">
								{isSubmitting ? "Memproses..." : "Kirim"}
							</Button>
						)}
					</form.Subscribe>
				</div>
			</form>
		</div>
	);
}
