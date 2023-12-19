// Load history from localStorage when the page loads
window.onload = function () {
	loadHistory();
};

function saveHistoryToLocalStorage(history) {
	// Save the history as a JSON string in localStorage
	localStorage.setItem("history", JSON.stringify(history));
}

function loadHistoryFromLocalStorage() {
	// Retrieve the history from localStorage
	const historyString = localStorage.getItem("history");

	// Parse the JSON string to get the history array
	return JSON.parse(historyString) || [];
}

function loadHistory() {
	const history = loadHistoryFromLocalStorage();
	const modalHistoryElement = document.getElementById("modal-history");

	// Display history in the modal
	modalHistoryElement.innerHTML = "<h2>Riwayat</h2>";
	history.forEach((entry, index) => {
		// Tambahkan tombol hapus dengan memanggil removeFromHistory(index)
		modalHistoryElement.innerHTML += `
      <p>${entry} <button class = "hitung" onclick="removeFromHistory(${index})">Hapus</button></p>
    `;
	});
}

function addToHistory(entry) {
	const history = loadHistoryFromLocalStorage();
	const percobaanKe = history.length + 1;
	const historyEntry = `Percobaan ke-${percobaanKe}: ${entry}`;
	history.push(historyEntry);
	saveHistoryToLocalStorage(history);
}

function clearHistory() {
	// Menghapus riwayat dari localStorage
	localStorage.removeItem("history");

	// Memuat kembali halaman untuk menampilkan perubahan
	location.reload();
}

function removeFromHistory(index) {
	const history = loadHistoryFromLocalStorage();
	history.splice(index, 1); // Hapus entri dengan indeks tertentu
	saveHistoryToLocalStorage(history);
	loadHistory(); // Muat ulang riwayat setelah menghapus
}

function hitung() {
	let sudutBiasa1 = totalSudut(
		"derajat-biasa-1",
		"menit-biasa-1",
		"detik-biasa-1",
		"derajat-biasa-2",
		"menit-biasa-2",
		"detik-biasa-2"
	);
	let sudutLuarBiasa1 = totalSudut(
		"derajat-luar-1",
		"menit-luar-1",
		"detik-luar-1",
		"derajat-luar-2",
		"menit-luar-2",
		"detik-luar-2"
	);

	document.getElementById("result1").innerHTML = `
        <p>total Sudut Biasa seri 2: ${decimalToDMS(sudutBiasa1)} derajat</p>
        <p>total Sudut Luar Biasa seri 2: ${decimalToDMS(
					sudutLuarBiasa1
				)} derajat</p>
    `;

	let sudutBiasa2 = totalSudut(
		"derajat-biasa-3",
		"menit-biasa-3",
		"detik-biasa-3",
		"derajat-biasa-4",
		"menit-biasa-4",
		"detik-biasa-4"
	);
	let sudutLuarBiasa2 = totalSudut(
		"derajat-luar-3",
		"menit-luar-3",
		"detik-luar-3",
		"derajat-luar-4",
		"menit-luar-4",
		"detik-luar-4"
	);

	let rerataSudut =
		(sudutBiasa1 + sudutBiasa2 + sudutLuarBiasa1 + sudutLuarBiasa2) / 4;

	let selisih = [
		{
			"biasa seri 1": Math.abs(rerataSudut - sudutBiasa1),
		},
		{
			"biasa seri 2": Math.abs(rerataSudut - sudutBiasa2),
		},
		{
			"luar biasa seri 1": Math.abs(rerataSudut - sudutLuarBiasa1),
		},
		{
			"luar biasa seri 2": Math.abs(rerataSudut - sudutLuarBiasa2),
		},
	];

	let torDMS = 10 / 3600;

	let pesan = "";

	for (let i = 0; i < selisih.length; i++) {
		let nilaiSelisih = Object.values(selisih[i])[0];

		if (nilaiSelisih >= torDMS) {
			pesan += `Sudut ${
				Object.keys(selisih[i])[0]
			} perlu diukur ulang (${decimalToDMS(
				nilaiSelisih
			)} lebih dari 10 detik).<br>`;
		}
	}

	document.getElementById("all-result").innerHTML = `
        <div id="result1">
            <p>total Sudut Biasa seri 1: ${decimalToDMS(
							sudutBiasa1
						)} derajat</p>
            <p>total Sudut Luar Biasa seri 1: ${decimalToDMS(
							sudutLuarBiasa1
						)} derajat</p>
        </div>
        <div id="result2">
            <p>total Sudut Biasa seri 2: ${decimalToDMS(sudutBiasa2)}</p>
            <p>total Sudut Luar Biasa seri 2: ${decimalToDMS(
							sudutLuarBiasa2
						)}</p>
        </div>
        <div id="rata-rata">
            <p>Rata-rata Sudut: ${decimalToDMS(rerataSudut)}</p>
        </div>
        <div id="hasilPerbandingan">
            ${pesan}
        </div>
    `;

	// Save the result to history
	const historyEntry = `
        <div id="result1">
            <p>total Sudut Biasa seri 1: ${decimalToDMS(
							sudutBiasa1
						)} derajat</p>
            <p>total Sudut Luar Biasa seri 1: ${decimalToDMS(
							sudutLuarBiasa1
						)} derajat</p>
        </div>
        <div id="result2">
            <p>total Sudut Biasa seri 2: ${decimalToDMS(sudutBiasa2)}</p>
            <p>total Sudut Luar Biasa seri 2: ${decimalToDMS(
							sudutLuarBiasa2
						)}</p>
        </div>
		<div id="rata-rata">
			<p>Rata-rata SudutDMS: ${decimalToDMS(rerataSudut)}</p>
		</div>
        <div id="rata-rata">
            <p>Rata-rata Sudut: ${rerataSudut.toFixed(6)}</p>
        </div>
        <div id="hasilPerbandingan">
            ${pesan}
        </div>
    `;
	addToHistory(historyEntry);
}

function hitungSumRerataSudut() {
	// Tampilkan indikator loading
	const loadingIndicator = document.getElementById("loading-indicator");
	loadingIndicator.style.display = "block";

	const sumResultElement = document.getElementById("sumResult");
	sumResultElement.innerHTML = "";

	// Setelah 3 detik, jalankan proses perhitungan
	setTimeout(() => {
		// Jalankan proses perhitungan
		const history = loadHistoryFromLocalStorage();

		if (history.length === 0) {
			// Sembunyikan indikator loading
			loadingIndicator.style.display = "none";

			// Tampilkan notifikasi bahwa history tidak ada
			const notificationElement = document.createElement("div");
			notificationElement.className = "notification";
			notificationElement.innerHTML =
				"<h1>Tidak ada pengukuran yang dilakukan</h1>";

			// Tambahkan notifikasi ke dalam elemen hasil
			sumResultElement.appendChild(notificationElement);
		} else {
			// Ambil sudut rerata dari setiap entri riwayat yang memiliki pesan
			const rerataSudutArray = history.reduce((accumulator, entry) => {
				const pesanMatch = entry.match(
					/<div id="hasilPerbandingan">([^<]+)<\/div>/
				);

				// Cek apakah percobaan memiliki pesan atau tidak
				if (pesanMatch) {
					const rerataSudutMatch = entry.match(/Rata-rata Sudut: (\S+)/);
					if (rerataSudutMatch) {
						const parsedValue = parseFloat(rerataSudutMatch[1]);
						// Hanya tambahkan jika berhasil di-parse
						if (!isNaN(parsedValue)) {
							accumulator.push(parsedValue);
						}
					}
				}

				return accumulator;
			}, []);

			// Hitung SUM dari sudut rerata yang ada dalam riwayat yang memiliki pesan
			const sumRerataSudut = rerataSudutArray.reduce(
				(sum, rerataSudut) => sum + rerataSudut,
				0
			);

			const jumlahPercobaan = history.reduce((count, entry) => {
				const pesanMatch = entry.match(
					/<div id="hasilPerbandingan">([^<]+)<\/div>/
				);
				return pesanMatch ? count + 1 : count;
			}, 0);

			const rumusTOR = (jumlahPercobaan - 2) * 180;

			const FS = Math.abs(sumRerataSudut - rumusTOR);

			// Sembunyikan indikator loading
			loadingIndicator.style.display = "none";

			// Tampilkan hasil SUM dan FS pada elemen dengan ID "sumResult" di dalam modal
			document.getElementById("sumResult").innerHTML = `
			<p>Total Rerata Sudut: ${sumRerataSudut.toFixed(5)}</p>
			<p>Rumus TOR: ${rumusTOR.toFixed(5)}</p>
			<p>FS: ${decimalToDMS(FS)}</p>
			`;
		}
		// Mengaktifkan kembali tombol setelah proses selesai
		button.disabled = false;
	}, 3000);
	// Mengatur waktu timeout menjadi 3 detik (3000 milidetik)
}

function hitungKKH(dataJarak) {
	const history = loadHistoryFromLocalStorage();

	const rerataSudutArray = history.reduce((accumulator, entry) => {
		const pesanMatch = entry.match(
			/<div id="hasilPerbandingan">([^<]+)<\/div>/
		);

		if (pesanMatch) {
			const rerataSudutMatch = entry.match(/Rata-rata Sudut: (\S+)/);
			if (rerataSudutMatch) {
				const parsedValue = parseFloat(rerataSudutMatch[1]);
				// Hanya tambahkan jika berhasil di-parse
				if (!isNaN(parsedValue)) {
					accumulator.push(parsedValue);
				}
			}
		}

		return accumulator;
	}, []);

	const sumRerataSudut = rerataSudutArray.reduce(
		(sum, rerataSudut) => sum + rerataSudut,
		0
	);

	const jumlahPercobaan = history.reduce((count, entry) => {
		const pesanMatch = entry.match(
			/<div id="hasilPerbandingan">([^<]+)<\/div>/
		);
		return pesanMatch ? count + 1 : count;
	}, 0);

	const rumusTOR = (jumlahPercobaan - 2) * 180;

	const FS = Math.abs(sumRerataSudut - rumusTOR);
	const koreksiSudut = FS / jumlahPercobaan;
	console.log(`Koreksi Sudut: ${koreksiSudut.toFixed(5)}`);

	const sudutTerkoreksi = rerataSudutArray.map((rerataSudut) =>
		(rerataSudut + koreksiSudut).toFixed(5)
	);
	console.log(`sudut terkoreksi: ${sudutTerkoreksi}`);

	// Mendapatkan nilai azimuth dari input pengguna dalam bentuk DMS
	const derajatAzimuth =
		parseFloat(document.getElementById("derajat-azimuth").value) || 0;
	const menitAzimuth =
		parseFloat(document.getElementById("menit-azimuth").value) || 0;
	const detikAzimuth =
		parseFloat(document.getElementById("detik-azimuth").value) || 0;

	const azimuthDMS = derajatAzimuth + menitAzimuth / 60 + detikAzimuth / 3600;
	const azimuthDesimal = dmsToDesimal(
		derajatAzimuth,
		menitAzimuth,
		detikAzimuth
	);

	const koordinatX =
		parseFloat(document.getElementById("koordinatX").value) || 0;
	const koordinatY =
		parseFloat(document.getElementById("koordinatY").value) || 0;

	let azimuth = azimuthDesimal;

	let azimuthArray = [azimuthDesimal];

	// Sin Azimuth Awal Start
	const sinAzimuthAwal = Math.sin((azimuthDesimal * Math.PI) / 180);
	console.log(
		`Azimuth Awal: ${azimuthDesimal.toFixed(
			5
		)}, Sin Azimuth Awal: ${sinAzimuthAwal.toFixed(5)}`
	);
	// Sin Azimuth Awal End

	// Cos Azimuth Awal Start
	const cosAzimuthAwal = Math.cos((azimuthDesimal * Math.PI) / 180);
	console.log(
		`Azimuth Awal: ${azimuthDesimal.toFixed(
			5
		)}, cos Azimuth Awal: ${cosAzimuthAwal.toFixed(5)}`
	);
	// Cos Azimuth Awal End

	// Azimuth Start
	let sinAzimuthArray = [sinAzimuthAwal];
	let cosAzimuthArray = [cosAzimuthAwal];

	for (let i = 1; i < sudutTerkoreksi.length; i++) {
		let azimut = azimuth - sudutTerkoreksi[i] + 180;
		if (azimut > 360) {
			azimut -= 360;
		}

		const sinAzimuth = Math.sin((azimut * Math.PI) / 180);
		const cosAzimuth = Math.cos((azimut * Math.PI) / 180);

		console.log(
			`Azimuth${i}: ${azimut.toFixed(5)}, Sin Azimuth${i}: ${sinAzimuth.toFixed(
				5
			)}`
		);
		console.log(
			`Azimuth${i}: ${azimut.toFixed(5)}, Cos Azimuth${i}: ${cosAzimuth.toFixed(
				5
			)}`
		);
		azimuthArray.push(azimut);
		sinAzimuthArray.push(sinAzimuth);
		cosAzimuthArray.push(cosAzimuth);
		azimuth = azimut;
	}
	// Azimuth End

	// Total Jarak Start
	const dataCSVJarak = dataJarak.flat();

	const totalJarak = dataCSVJarak.reduce((sum, jarak) => {
		// Pastikan jarak adalah angka yang valid
		const jarakDesimal = parseFloat(jarak);
		if (!isNaN(jarakDesimal)) {
			return sum + jarakDesimal;
		} else {
			return sum;
		}
	}, 0);
	// Total Jarak End

	// Dsin Dcos Asal Start
	const dsinAsal = dataJarak.map((jarak, index) => {
		const hasilDsinAwal = jarak * sinAzimuthArray[index];
		return hasilDsinAwal;
	});
	const dcosAsal = dataJarak.map((jarak, index) => {
		const hasilDcosAwal = jarak * cosAzimuthArray[index];
		return hasilDcosAwal;
	});

	const dsinAsalArray = dsinAsal.map((h) => Number(h.toFixed(5)));
	const dcosAsalArray = dcosAsal.map((h) => Number(h.toFixed(5)));

	const totalDsinAsal = dsinAsalArray.reduce((sum, dsinAsal) => {
		const dsinAsalDesimal = parseFloat(dsinAsal);
		if (!isNaN(dsinAsalDesimal)) {
			return sum + dsinAsalDesimal;
		} else {
			return sum;
		}
	}, 0);
	const totalDcosAsal = dcosAsalArray.reduce((sum, dcosAsal) => {
		const dcosAsalDesimal = parseFloat(dcosAsal);
		if (!isNaN(dcosAsalDesimal)) {
			return sum + dcosAsalDesimal;
		} else {
			return sum;
		}
	}, 0);
	// Dsin Dcos Asal End

	// Dsin Koreksi Start
	const dsinKoreksi = dataJarak.map((jarak, index) => {
		const hasilDsinAwal = (jarak / totalJarak) * totalDsinAsal;
		return hasilDsinAwal;
	});

	const totalDsinKoreksi = dsinKoreksi.reduce((sum, dsinKoreksi) => {
		const dsinKoreksiDesimal = parseFloat(dsinKoreksi);
		if (!isNaN(dsinKoreksiDesimal)) {
			return sum + dsinKoreksiDesimal;
		} else {
			return sum;
		}
	}, 0);

	// Dsin Koreksi End

	// Dcos Koreksi Start
	const dcosKoreksi = dataJarak.map((jarak, index) => {
		const hasilDcosAwal = (jarak / totalJarak) * totalDcosAsal;
		return hasilDcosAwal;
	});

	const totalDcosKoreksi = dcosKoreksi.reduce((sum, dcosKoreksi) => {
		const dcosKoreksiDesimal = parseFloat(dcosKoreksi);
		if (!isNaN(dcosKoreksiDesimal)) {
			return sum + dcosKoreksiDesimal;
		} else {
			return sum;
		}
	}, 0);
	// Dcos Koreksi End

	// Dsin Terkoreksi Start
	const dsinTerkoreksi = dsinAsal.map(
		(dsin, index) => dsin - dsinKoreksi[index]
	);

	const dsinTerkoreksiArray = [...dsinTerkoreksi];

	const totalDsinTerkoreksi = dsinTerkoreksi.reduce((sum, dsinTerkoreksi) => {
		const dsinTerkoreksiDesimal = parseFloat(dsinTerkoreksi);
		if (!isNaN(dsinTerkoreksiDesimal)) {
			return sum + dsinTerkoreksiDesimal;
		} else {
			return sum;
		}
	}, 0);
	// Dsin Terkoreksi End

	// Dcos Terkoreksi Start
	const dcosTerkoreksi = dcosAsal.map(
		(dcos, index) => dcos - dcosKoreksi[index]
	);

	const dcosTerkoreksiArray = [...dcosTerkoreksi];

	const totalDcosTerkoreksi = dcosTerkoreksi.reduce((sum, dcosTerkoreksi) => {
		const dcosTerkoreksiDesimal = parseFloat(dcosTerkoreksi);
		if (!isNaN(dcosTerkoreksiDesimal)) {
			return sum + dcosTerkoreksiDesimal;
		} else {
			return sum;
		}
	}, 0);
	// Dcos Terkoreksi End

	// Koordinat Start
	let koordinatDataX = [koordinatX]; // Include user-input coordinate
	let koordinatDataY = [koordinatY]; // Include user-input coordinate

	for (let i = 0; i < dsinTerkoreksiArray.length; i++) {
		let koorX = parseFloat(
			(koordinatDataX[i] + dsinTerkoreksiArray[i]).toFixed(3)
		);
		koordinatDataX.push(koorX);
	}
	for (let i = 0; i < dcosTerkoreksiArray.length; i++) {
		let koorY = parseFloat(
			(koordinatDataY[i] + dcosTerkoreksiArray[i]).toFixed(3)
		);
		koordinatDataY.push(koorY);
	}

	// Output the result with 3 decimal places and the user-input coordinate

	// Koordinat End

	const resultHeadTable = document.getElementById("table-head");

	const trHead = document.createElement("tr");

	const titik = document.createElement("th");
	titik.textContent = "TITIK";
	titik.setAttribute("rowspan", "2");
	trHead.appendChild(titik);

	const sudutDalam = document.createElement("th");
	sudutDalam.textContent = "Sudut Dalam";
	sudutDalam.setAttribute("colspan", "5");
	trHead.appendChild(sudutDalam);

	const azimuthTh = document.createElement("th");
	azimuthTh.textContent = "Azimut";
	azimuthTh.setAttribute("rowspan", "2");
	trHead.appendChild(azimuthTh);

	const JarakTh = document.createElement("th");
	JarakTh.textContent = "Jarak";
	JarakTh.setAttribute("rowspan", "2");
	trHead.appendChild(JarakTh);

	const DsinTh = document.createElement("th");
	DsinTh.textContent = "Dsin α";
	DsinTh.setAttribute("colspan", "3");
	trHead.appendChild(DsinTh);

	const DcosTh = document.createElement("th");
	DcosTh.textContent = "Dcos α";
	DcosTh.setAttribute("colspan", "3");
	trHead.appendChild(DcosTh);

	const koordinatTh = document.createElement("th");
	koordinatTh.textContent = "Koordinat";
	koordinatTh.setAttribute("colspan", "3");
	trHead.appendChild(koordinatTh);

	resultHeadTable.appendChild(trHead);

	const trSubHead = document.createElement("tr");

	const thDerajat = document.createElement("th");
	thDerajat.textContent = "D";
	trSubHead.appendChild(thDerajat);

	const thMenit = document.createElement("th");
	thMenit.textContent = "M";
	trSubHead.appendChild(thMenit);

	const thDetik = document.createElement("th");
	thDetik.textContent = "S";
	trSubHead.appendChild(thDetik);

	const thKoreksi = document.createElement("th");
	thKoreksi.textContent = "Koreksi";
	trSubHead.appendChild(thKoreksi);

	const thTerkoreksi = document.createElement("th");
	thTerkoreksi.textContent = "Terkoreksi";
	trSubHead.appendChild(thTerkoreksi);

	const thAsal = document.createElement("th");
	thAsal.textContent = "Asal";
	trSubHead.appendChild(thAsal);

	const thKoreksi1 = document.createElement("th");
	thKoreksi1.textContent = "Koreksi";
	trSubHead.appendChild(thKoreksi1);

	const thTerkoreksi1 = document.createElement("th");
	thTerkoreksi1.textContent = "Terkoreksi";
	trSubHead.appendChild(thTerkoreksi1);

	const thAsal1 = document.createElement("th");
	thAsal1.textContent = "Asal";
	trSubHead.appendChild(thAsal1);

	const thKoreksi2 = document.createElement("th");
	thKoreksi2.textContent = "Koreksi";
	trSubHead.appendChild(thKoreksi2);

	const thTerkoreksi2 = document.createElement("th");
	thTerkoreksi2.textContent = "Terkoreksi";
	trSubHead.appendChild(thTerkoreksi2);

	const thKoordinatX = document.createElement("th");
	thKoordinatX.textContent = "X";
	trSubHead.appendChild(thKoordinatX);

	const thKoordinatY = document.createElement("th");
	thKoordinatY.textContent = "Y";
	trSubHead.appendChild(thKoordinatY);

	resultHeadTable.appendChild(trSubHead);

	const resultTableBody = document.getElementById("table-body");

	for (let i = 0; i < rerataSudutArray.length; i++) {
		const tr = document.createElement("tr");

		// Kolom pertama: Tertulis "BM" diikuti dengan nomor indeks
		const kolomPertamaTd = document.createElement("td");
		kolomPertamaTd.textContent = `BM ${i + 1}`;
		kolomPertamaTd.style.padding = "4px"; // Tambahkan padding
		tr.appendChild(kolomPertamaTd);

		// Kolom kedua: Derajat
		const rerataSudutTd = document.createElement("td");
		const rerataSudutDMS = decimalToDMS(rerataSudutArray[i]);

		// Membagi nilai DMS menjadi derajat, menit, dan detik
		const [derajat, menit, detik] = rerataSudutDMS.split(" ");
		rerataSudutTd.textContent = derajat.replace("°", ""); // Hapus simbol derajat
		rerataSudutTd.style.padding = "4px"; // Tambahkan padding
		tr.appendChild(rerataSudutTd);

		// Kolom ketiga: Menit
		const menitTd = document.createElement("td");
		menitTd.textContent = menit.replace("'", ""); // Hapus simbol menit
		menitTd.style.padding = "4px"; // Tambahkan padding
		tr.appendChild(menitTd);

		// Kolom keempat: Detik
		const detikTd = document.createElement("td");
		detikTd.textContent = detik.replace('"', ""); // Hapus simbol detik
		detikTd.style.padding = "4px"; // Tambahkan padding
		tr.appendChild(detikTd);

		const koreksiSudutTd = document.createElement("td");
		koreksiSudutTd.textContent = koreksiSudut.toFixed(5);
		koreksiSudutTd.style.padding = "4px"; // Tambahkan padding
		tr.appendChild(koreksiSudutTd);

		const sudutTerkoreksiTd = document.createElement("td");
		sudutTerkoreksiTd.textContent = dsinTerkoreksi[i].toFixed(5);
		sudutTerkoreksiTd.style.padding = "4px"; // Tambahkan padding
		tr.appendChild(sudutTerkoreksiTd);

		for (let i = 0; i < 8; i++) {
			const spaceKosong = document.createElement("td");
			spaceKosong.textContent = "";
			tr.appendChild(spaceKosong);
		}

		const hasilKoordinatXTd = document.createElement("td");
		hasilKoordinatXTd.textContent = koordinatDataX[i].toFixed(3); // Sesuaikan jumlah desimal
		hasilKoordinatXTd.style.padding = "4px";
		tr.appendChild(hasilKoordinatXTd);

		const hasilKoordinatYTd = document.createElement("td");
		hasilKoordinatYTd.textContent = koordinatDataY[i].toFixed(3); // Sesuaikan jumlah desimal
		hasilKoordinatYTd.style.padding = "4px";
		tr.appendChild(hasilKoordinatYTd);

		resultTableBody.appendChild(tr);

		const trAzimuth = document.createElement("tr");

		for (let i = 0; i < 5; i++) {
			const spaceKosong = document.createElement("td");
			spaceKosong.textContent = "";
			trAzimuth.appendChild(spaceKosong);
		}

		// Kolom ketiga untuk memberikan spasi pada Sudut Terkoreksi
		const sudutTerkoreksiSpaceTd = document.createElement("td");
		sudutTerkoreksiSpaceTd.textContent = "";
		sudutTerkoreksiSpaceTd.style.padding = "4px"; // Tambahkan padding
		trAzimuth.appendChild(sudutTerkoreksiSpaceTd);

		// Kolom keempat untuk menampilkan nilai Azimuth
		const azimuthArrayTd = document.createElement("td");
		azimuthArrayTd.textContent = azimuthArray[i].toFixed(5);
		azimuthArrayTd.style.padding = "4px"; // Tambahkan padding
		trAzimuth.appendChild(azimuthArrayTd);

		const jarakArrayTd = document.createElement("td");
		jarakArrayTd.textContent = dataJarak[i].toFixed(5);
		jarakArrayTd.style.padding = "4px"; // Tambahkan padding
		trAzimuth.appendChild(jarakArrayTd);

		const dsinAsalArrayTd = document.createElement("td");
		dsinAsalArrayTd.textContent = dsinAsalArray[i].toFixed(5);
		dsinAsalArrayTd.style.padding = "4px"; // Tambahkan padding
		trAzimuth.appendChild(dsinAsalArrayTd);

		const dsinKoreksiArrayTd = document.createElement("td");
		dsinKoreksiArrayTd.textContent = dsinKoreksi[i].toFixed(5);
		dsinKoreksiArrayTd.style.padding = "4px"; // Tambahkan padding
		trAzimuth.appendChild(dsinKoreksiArrayTd);

		const dsinTerkoreksiArrayTd = document.createElement("td");
		dsinTerkoreksiArrayTd.textContent = dsinTerkoreksi[i].toFixed(5);
		dsinTerkoreksiArrayTd.style.padding = "4px"; // Tambahkan padding
		trAzimuth.appendChild(dsinTerkoreksiArrayTd);

		const dcosAsalArrayTd = document.createElement("td");
		dcosAsalArrayTd.textContent = dcosAsalArray[i].toFixed(5);
		dcosAsalArrayTd.style.padding = "4px"; // Tambahkan padding
		trAzimuth.appendChild(dcosAsalArrayTd);

		const dcosKoreksiArrayTd = document.createElement("td");
		dcosKoreksiArrayTd.textContent = dcosKoreksi[i].toFixed(5);
		dcosKoreksiArrayTd.style.padding = "4px"; // Tambahkan padding
		trAzimuth.appendChild(dcosKoreksiArrayTd);

		const dcosTerkoreksiArrayTd = document.createElement("td");
		dcosTerkoreksiArrayTd.textContent = dcosTerkoreksi[i].toFixed(5);
		dcosTerkoreksiArrayTd.style.padding = "2px"; // Tambahkan padding
		trAzimuth.appendChild(dcosTerkoreksiArrayTd);

		const koordinatXSpace = document.createElement("td");
		koordinatXSpace.textContent = "";
		trAzimuth.appendChild(koordinatXSpace);

		const koordinatYSpace = document.createElement("td");
		koordinatYSpace.textContent = "";
		trAzimuth.appendChild(koordinatYSpace);

		// Tambahkan trAzimuth ke dalam tabel
		resultTableBody.appendChild(trAzimuth);
	}
	const trSum = document.createElement("tr");

	const kolomSumPertama = document.createElement("td");
	kolomSumPertama.textContent = "";
	kolomSumPertama.style.padding = "4px"; // Tambahkan padding
	trSum.appendChild(kolomSumPertama);

	for (let i = 0; i <= 5; i++) {
		const spaceKosong = document.createElement("td");
		spaceKosong.textContent = "";
		trSum.appendChild(spaceKosong);
	}

	const totalJarakTd = document.createElement("td");
	totalJarakTd.textContent = totalJarak.toFixed(3);
	totalJarakTd.style.padding = "4px";
	trSum.appendChild(totalJarakTd);

	const totalDsinAsalTd = document.createElement("td");
	totalDsinAsalTd.textContent = totalDsinAsal.toFixed(5);
	totalDsinAsalTd.style.padding = "4px";
	trSum.appendChild(totalDsinAsalTd);

	const totalDsinKoreksiTd = document.createElement("td");
	totalDsinKoreksiTd.textContent = totalDsinKoreksi.toFixed(5);
	totalDsinKoreksiTd.style.padding = "4px";
	trSum.appendChild(totalDsinKoreksiTd);

	const totalDsinTerkoreksiTd = document.createElement("td");
	totalDsinTerkoreksiTd.textContent = Math.abs(totalDsinTerkoreksi).toFixed(5);
	totalDsinTerkoreksiTd.style.padding = "4px";
	trSum.appendChild(totalDsinTerkoreksiTd);

	const totalDcosAsalTd = document.createElement("td");
	totalDcosAsalTd.textContent = totalDcosAsal.toFixed(5);
	totalDcosAsalTd.style.padding = "4px";
	trSum.appendChild(totalDcosAsalTd);

	const totalDcosKoreksiTd = document.createElement("td");
	totalDcosKoreksiTd.textContent = totalDcosKoreksi.toFixed(5);
	totalDcosKoreksiTd.style.padding = "4px";
	trSum.appendChild(totalDcosKoreksiTd);

	const totalDcosTerkoreksiTd = document.createElement("td");
	totalDcosTerkoreksiTd.textContent = Math.abs(totalDcosTerkoreksi).toFixed(5);
	totalDcosTerkoreksiTd.style.padding = "4px";
	trSum.appendChild(totalDcosTerkoreksiTd);

	for (let i = 0; i <= 1; i++) {
		const spaceKosong = document.createElement("td");
		spaceKosong.textContent = "";
		trSum.appendChild(spaceKosong);
	}

	resultTableBody.appendChild(trSum);

	const resultButtonDownload = document.createElement("button");
	resultButtonDownload.textContent = "Download Excel";
	resultButtonDownload.className = "hitung";
	resultButtonDownload.textContent = "Download Excel";
	resultButtonDownload.addEventListener("click", exportToExcel);
	const targetElement = document.querySelector(".button-excel");
	targetElement.appendChild(resultButtonDownload);

	console.log("Total Jarak: ", totalJarak.toFixed(3));
	console.log("Dsin Asal:", dsinAsalArray.join(", "));
	console.log("Dcos Asal:", dcosAsalArray.join(", "));
	console.log("Total Dsin Asal:", totalDsinAsal.toFixed(5));
	console.log("Total Dcos Asal:", totalDcosAsal.toFixed(5));
	console.log("Dsin Koreksi:", dsinKoreksi.join(", "));
	console.log("Dcos Koreksi:", dcosKoreksi.join(", "));
	console.log("Dsin Terkoreksi:", dsinTerkoreksi.join(", "));
	console.log("Dcos Terkoreksi:", dcosTerkoreksi.join(", "));
	console.log("Rerata Sudut Array:", rerataSudutArray.join(", "));
	console.log("Hasil Perhitungan:", koordinatDataX.join(", "));
	console.log("Hasil Perhitungan:", koordinatDataY.join(", "));
}

function showModal() {
	// Memanggil fungsi loadHistory untuk menampilkan riwayat di dalam modal
	loadHistory();
	const modal = document.getElementById("all-result-modal");
	modal.style.display = "block";
}

function closeModal() {
	const modal = document.getElementById("all-result-modal");
	modal.style.display = "none";
}

// Menutup modal jika pengguna mengklik di luar area kontennya
window.onclick = function (event) {
	const modal = document.getElementById("all-result-modal");
	if (event.target === modal) {
		modal.style.display = "none";
	}
};

const calculateButton = document.getElementById("calculateButton");

calculateButton.addEventListener("click", handleFile);

function handleFile() {
	const fileInput = document.getElementById("fileInput");
	const file = fileInput.files[0];

	if (file) {
		const reader = new FileReader();

		reader.onload = function (e) {
			const csvContent = e.target.result;
			const rows = csvContent.split("\n");
			const dataJarak = rows.map((row) => {
				// Menghapus karakter \r dan mengonversi ke number
				const cleanedRow = row.replace(/\r/g, "").trim();
				return cleanedRow ? parseFloat(cleanedRow) : null;
			});

			// Menghapus elemen array yang bernilai null
			const filteredDataJarak = dataJarak.filter((value) => value !== null);

			console.log("Data Jarak:", filteredDataJarak);
			// Do not call hitungKKH here
			// hitungKKH(filteredDataJarak);
		};

		reader.readAsText(file);
	} else {
		alert("Pilih file CSV terlebih dahulu.");
	}
}

function calculateKKH() {
	const loading = document.getElementById("loading-indicator1");
	loading.style.display = "block";
	
	const resultTableHead = document.getElementById("table-head");
	resultTableHead.innerHTML = "";
	const resultTableBody = document.getElementById("table-body");
	resultTableBody.innerHTML = "";
	
	const downloadButton = document.getElementById("downloadcsv");
	downloadButton.style.display = "none";

	setTimeout(() => {
		const fileInput = document.getElementById("fileInput");
		const file = fileInput.files[0];

		if (file) {
			const reader = new FileReader();
			loading.style.display = "none";

			reader.onload = function (e) {
				const csvContent = e.target.result;
				const rows = csvContent.split("\n");
				const dataJarak = rows.map((row) => {
					// Menghapus karakter \r dan mengonversi ke number
					const cleanedRow = row.replace(/\r/g, "").trim();
					return cleanedRow ? parseFloat(cleanedRow) : null;
				});

				// Menghapus elemen array yang bernilai null
				const filteredDataJarak = dataJarak.filter((value) => value !== null);

				console.log("Data Jarak:", filteredDataJarak);

				// Clear existing results in the table
				const resultTableBody = document.getElementById("table-body");
				resultTableBody.innerHTML = "";

				// Perform the calculation and display the new results
				hitungKKH(filteredDataJarak);
			};

			reader.readAsText(file);
		} else {
			alert("Pilih file jarak.csv terlebih dahulu.");
		}

		const downloadButton = document.getElementById("downloadcsv");
		downloadButton.style.display = "block";
		downloadButton.style.marginTop = "20px";
	}, 2000);
}

function SudutDD(derajatId, menitId, detikId) {
	let derajat = parseFloat(document.getElementById(derajatId).value) || 0;
	let menit = parseFloat(document.getElementById(menitId).value) || 0;
	let detik = parseFloat(document.getElementById(detikId).value) || 0;

	const DMStoDecimal = derajat + menit / 60 + detik / 3600;

	return DMStoDecimal;
}

function totalSudut(
	derajatId1,
	menitId1,
	detikId1,
	derajatId2,
	menitId2,
	detikId2
) {
	let sudut1 = SudutDD(derajatId1, menitId1, detikId1);
	let sudut2 = SudutDD(derajatId2, menitId2, detikId2);

	let totalSudut = sudut2 - sudut1;

	if (totalSudut > 360) {
		totalSudut -= 360;
	} else if (totalSudut < 0) {
		totalSudut += 360;
	}

	return totalSudut;
}

function decimalToDMS(decimalDegrees) {
	const derajat = Math.floor(decimalDegrees);
	const menitDecimal = (decimalDegrees - derajat) * 60;
	const menit = Math.floor(menitDecimal);
	const detik = (menitDecimal - menit) * 60;

	return `${derajat}° ${menit}' ${detik.toFixed(2)}"`;
}

function dmsToDesimal(derajat, menit, detik) {
	const nilaiDesimal = derajat + menit / 60 + detik / 3600;
	return nilaiDesimal;
}

function exportToExcel() {
	const resultTable = document.getElementById("table");

	// Membuat objek Workbook baru
	const wb = XLSX.utils.book_new();
	const ws = XLSX.utils.table_to_sheet(resultTable);

	// Menambahkan sheet ke workbook
	XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

	// Menyimpan workbook sebagai file Excel
	XLSX.writeFile(wb, "hasil_perhitungan.xlsx");
}
