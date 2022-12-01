function validateImageFile(imageFile) {
    const allowedImageType = [
        'image/png',
        'image/jpg',
        'image/gif',
        'image/jpeg',
    ];

    if (imageFile.size > 1024 * 1024 * 3) {
        return alert('이미지의 크기가 3MB를 초과했습니다.');
    }

    if (!allowedImageType.includes(imageFile.type)) {
        return alert('jpg, gif, png, jpeg 형식의 이미지만 등록할 수 있습니다.');
    }
}
