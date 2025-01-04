document.addEventListener("DOMContentLoaded", () => {
    // Mengambil data dari localStorage jika ada
    const dataMahasiswa = JSON.parse(localStorage.getItem("dataMahasiswa")) || [];

    const form = document.getElementById("formMahasiswa");
    const nimInput = document.getElementById("nim");
    const namaInput = document.getElementById("nama");
    const nilaiInput = document.getElementById("nilai");
    const tabelMahasiswa = document.getElementById("tabelMahasiswa");

    const tambahButton = document.getElementById("tambah");
    const urutkanButton = document.getElementById("urutkan");
    const simpanButton = document.getElementById("simpan");
    const bacaButton = document.getElementById("baca");

    // Fungsi untuk merender tabel data mahasiswa
    function renderTable() {
        tabelMahasiswa.innerHTML = "";
        dataMahasiswa.forEach((mhs, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${mhs.nim}</td>
                <td>${mhs.nama}</td>
                <td>${mhs.nilaiAkhir.toFixed(2)}</td>
                <td>
                    <button class="edit" data-index="${index}">Edit</button>
                    <button class="delete" data-index="${index}">Delete</button>
                </td>
            `;
            tabelMahasiswa.appendChild(row);
        });

        // Menambahkan event listener untuk tombol edit dan delete
        document.querySelectorAll(".edit").forEach(button => {
            button.addEventListener("click", editData);
        });

        document.querySelectorAll(".delete").forEach(button => {
            button.addEventListener("click", deleteData);
        });
    }

    // Fungsi untuk menambah data mahasiswa
    tambahButton.addEventListener("click", () => {
        const nim = nimInput.value;
        const nama = namaInput.value;
        const nilaiAkhir = parseFloat(nilaiInput.value);

        if (nim && nama && !isNaN(nilaiAkhir)) {
            const mahasiswa = { nim, nama, nilaiAkhir };
            dataMahasiswa.push(mahasiswa);
            localStorage.setItem("dataMahasiswa", JSON.stringify(dataMahasiswa)); // Simpan ke localStorage
            renderTable();
            form.reset();
        } else {
            alert("Semua field harus diisi dengan benar!");
        }
    });

    // Fungsi untuk mengurutkan data mahasiswa berdasarkan nilai akhir
    urutkanButton.addEventListener("click", () => {
        dataMahasiswa.sort((a, b) => b.nilaiAkhir - a.nilaiAkhir);
        localStorage.setItem("dataMahasiswa", JSON.stringify(dataMahasiswa)); // Simpan ke localStorage
        renderTable();
    });

    // Fungsi untuk menyimpan data mahasiswa ke berkas (local download)
    simpanButton.addEventListener("click", () => {
        const dataString = JSON.stringify(dataMahasiswa);
        const blob = new Blob([dataString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data_mahasiswa.json";
        a.click();
        URL.revokeObjectURL(url);
    });

    // Fungsi untuk membaca data dari berkas (file input)
    bacaButton.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (Array.isArray(data)) {
                            dataMahasiswa.splice(0, dataMahasiswa.length, ...data);
                            localStorage.setItem("dataMahasiswa", JSON.stringify(dataMahasiswa)); // Simpan ke localStorage
                            renderTable();
                        } else {
                            alert("File tidak valid.");
                        }
                    } catch (error) {
                        alert("Gagal membaca file.");
                    }
                };
                reader.readAsText(file);
            }
        });
        input.click();
    });

    // Fungsi untuk mengedit data mahasiswa
    function editData(event) {
        const index = event.target.getAttribute("data-index");
        const mahasiswa = dataMahasiswa[index];
        
        nimInput.value = mahasiswa.nim;
        namaInput.value = mahasiswa.nama;
        nilaiInput.value = mahasiswa.nilaiAkhir;

        // Menghapus data lama dan menggantinya dengan data baru setelah edit
        tambahButton.textContent = "Simpan Perubahan";
        tambahButton.onclick = () => {
            mahasiswa.nim = nimInput.value;
            mahasiswa.nama = namaInput.value;
            mahasiswa.nilaiAkhir = parseFloat(nilaiInput.value);

            localStorage.setItem("dataMahasiswa", JSON.stringify(dataMahasiswa)); // Simpan perubahan ke localStorage
            renderTable();
            form.reset();
            tambahButton.textContent = "Tambah"; // Kembali ke tombol tambah
            tambahButton.onclick = () => {
                const nim = nimInput.value;
                const nama = namaInput.value;
                const nilaiAkhir = parseFloat(nilaiInput.value);

                if (nim && nama && !isNaN(nilaiAkhir)) {
                    const mahasiswa = { nim, nama, nilaiAkhir };
                    dataMahasiswa.push(mahasiswa);
                    localStorage.setItem("dataMahasiswa", JSON.stringify(dataMahasiswa)); // Simpan ke localStorage
                    renderTable();
                    form.reset();
                } else {
                    alert("Semua field harus diisi dengan benar!");
                }
            };
        };
    }

    // Fungsi untuk menghapus data mahasiswa
    function deleteData(event) {
        const index = event.target.getAttribute("data-index");
        dataMahasiswa.splice(index, 1);
        localStorage.setItem("dataMahasiswa", JSON.stringify(dataMahasiswa)); // Simpan perubahan ke localStorage
        renderTable();
    }

    // Render tabel data ketika halaman pertama kali dimuat
    renderTable();
});
