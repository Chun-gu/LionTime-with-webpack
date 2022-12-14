export default function getImageDataURL(image) {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => resolve(e.target.result);
    fileReader.readAsDataURL(image);
  });
}
