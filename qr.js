class DblTimestampHelper {
  static timestampEncoding = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'R', 'S', 'T'];

  static createDblTimestamp() {
    let creationDate = Date.now().toString(16);
    let encodedTimestamp = '';

    for (let i = 0; i < creationDate.length; i++) {
      encodedTimestamp += DblTimestampHelper.timestampEncoding[parseInt(creationDate[i], 16)];
    }

    return encodedTimestamp;
  }

  static decodeDblTimestamp(timestampString) {
    let decodedDblTimestamp = '';

    for (let i = 0; i < timestampString.length; i++) {
      decodedDblTimestamp += DblTimestampHelper.timestampEncoding.indexOf(timestampString[i]).toString(16);
    }

    return decodedDblTimestamp;
  }
}

const createUrl = (url) => {
  return fetch(url).then(async (res) => {
    const blob = await res.blob();
    const url = URL.createObjectURL(blob)
    return url
  })
}
document.addEventListener("DOMContentLoaded", () => {
  const formElement = document.querySelector("#dbl-qr")
  const dblqr1 = document.querySelector("#dbl-qr-1")
  const dblqr2 = document.querySelector("#dbl-qr-2")
  const dblqr3 = document.querySelector("#dbl-qr-3")

  formElement.addEventListener("submit", (event) => {
    event.preventDefault()

    const storage = localStorage.getItem("codes")
    const codes = storage ? JSON.parse(storage) : [dblqr1.value, dblqr2.value, dblqr3.value]

    if (!storage) {
      localStorage.setItem("codes", JSON.stringify(codes))
    }

    for (let i in codes) {
      let newQr = "4," + codes[i] + DblTimestampHelper.createDblTimestamp()
      QRCode.toDataURL(newQr, async (err, url) => {
        const qrContainer = document.querySelector(`#qr-display-${parseInt(i)+1}`)
        qrContainer.innerHTML = "";

        const src = await createUrl(url)

        const img = document.createElement('img')
        img.src = src
        img.classList.add("qr-dbl")
        qrContainer.appendChild(img);
      })
    }
  })
})
