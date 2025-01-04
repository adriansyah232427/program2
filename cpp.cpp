#include <iostream>
#include <vector>
#include <fstream>
#include <algorithm>
#include <iomanip>

struct Mahasiswa {
    std::string nim;
    std::string nama;
    double nilaiAkhir;
};

void tambahData(std::vector<Mahasiswa>& data) {
    int jumlah;
    std::cout << "Masukkan jumlah mahasiswa: ";
    std::cin >> jumlah;
    std::cin.ignore();

    for (int i = 0; i < jumlah; ++i) {
        Mahasiswa m;
        std::cout << "Masukkan NIM Mahasiswa ke-" << (i + 1) << ": ";
        std::getline(std::cin, m.nim);
        std::cout << "Masukkan Nama Mahasiswa ke-" << (i + 1) << ": ";
        std::getline(std::cin, m.nama);
        std::cout << "Masukkan Nilai Akhir Mahasiswa ke-" << (i + 1) << ": ";
        std::cin >> m.nilaiAkhir;
        std::cin.ignore();
        data.push_back(m);
    }
    std::cout << "Data berhasil ditambahkan!\n";
}

void tampilkanData(const std::vector<Mahasiswa>& data) {
    if (data.empty()) {
        std::cout << "Tidak ada data untuk ditampilkan.\n";
        return;
    }

    std::cout << "\nData Mahasiswa:\n";
    std::cout << std::setw(15) << "NIM" << std::setw(25) << "Nama" << std::setw(15) << "Nilai Akhir" << '\n';
    for (const auto& m : data) {
        std::cout << std::setw(15) << m.nim << std::setw(25) << m.nama << std::setw(15) << m.nilaiAkhir << '\n';
    }
}

void cariData(const std::vector<Mahasiswa>& data) {
    std::string cariNIM;
    std::cout << "Masukkan NIM yang ingin dicari: ";
    std::cin >> cariNIM;

    for (const auto& m : data) {
        if (m.nim == cariNIM) {
            std::cout << "Data ditemukan:\n";
            std::cout << "NIM: " << m.nim << "\n";
            std::cout << "Nama: " << m.nama << "\n";
            std::cout << "Nilai Akhir: " << m.nilaiAkhir << "\n";
            return;
        }
    }
    std::cout << "Data dengan NIM " << cariNIM << " tidak ditemukan.\n";
}

void urutkanData(std::vector<Mahasiswa>& data) {
    std::sort(data.begin(), data.end(), [](const Mahasiswa& a, const Mahasiswa& b) {
        return a.nilaiAkhir > b.nilaiAkhir;
    });
    std::cout << "Data berhasil diurutkan berdasarkan Nilai Akhir (descending).\n";
}

void simpanKeBerkas(const std::vector<Mahasiswa>& data, const std::string& namaBerkas) {
    std::ofstream file(namaBerkas);
    if (!file) {
        std::cerr << "Gagal membuka file untuk menyimpan data.\n";
        return;
    }

    for (const auto& m : data) {
        file << m.nim << "," << m.nama << "," << m.nilaiAkhir << '\n';
    }

    std::cout << "Data berhasil disimpan ke dalam file \"" << namaBerkas << "\".\n";
}

void bacaDariBerkas(std::vector<Mahasiswa>& data, const std::string& namaBerkas) {
    std::ifstream file(namaBerkas);
    if (!file) {
        std::cerr << "Gagal membuka file untuk membaca data.\n";
        return;
    }

    data.clear();
    Mahasiswa m;
    std::string line;
    while (std::getline(file, line)) {
        size_t pos1 = line.find(',');
        size_t pos2 = line.find(',', pos1 + 1);

        if (pos1 != std::string::npos && pos2 != std::string::npos) {
            m.nim = line.substr(0, pos1);
            m.nama = line.substr(pos1 + 1, pos2 - pos1 - 1);
            m.nilaiAkhir = std::stod(line.substr(pos2 + 1));
            data.push_back(m);
        }
    }

    std::cout << "Data berhasil dibaca dari file \"" << namaBerkas << "\".\n";
}

int main() {
    std::vector<Mahasiswa> dataMahasiswa;
    std::string namaBerkas = "data_mahasiswa.txt";

    while (true) {
        std::cout << "\nMenu Utama:\n";
        std::cout << "1. Tambah Data Mahasiswa\n";
        std::cout << "2. Tampilkan Semua Data\n";
        std::cout << "3. Cari Data Mahasiswa\n";
        std::cout << "4. Urutkan Data\n";
        std::cout << "5. Simpan Data ke Berkas\n";
        std::cout << "6. Baca Data dari Berkas\n";
        std::cout << "7. Keluar\n";
        std::cout << "Pilih opsi (1-7): ";

        int pilihan;
        std::cin >> pilihan;
        std::cin.ignore();

        switch (pilihan) {
            case 1:
                tambahData(dataMahasiswa);
                break;
            case 2:
                tampilkanData(dataMahasiswa);
                break;
            case 3:
                cariData(dataMahasiswa);
                break;
            case 4:
                urutkanData(dataMahasiswa);
                break;
            case 5:
                simpanKeBerkas(dataMahasiswa, namaBerkas);
                break;
            case 6:
                bacaDariBerkas(dataMahasiswa, namaBerkas);
                break;
            case 7:
                std::cout << "Keluar dari program.\n";
                return 0;
            default:
                std::cout << "Pilihan tidak valid.\n";
        }
    }
}
