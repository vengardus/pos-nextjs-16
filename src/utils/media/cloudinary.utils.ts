export const getImagePublicIdFromCloudinary = (url: string) => {
    const parts = url.split('/');
    console.log("parts", parts);
    const filename = (parts.pop()??"").split('.')[0]; // Elimina la extensión
    const folderPath = parts.slice(parts.indexOf('upload') + 2).join('/');
    console.log("indeof", parts.indexOf('upload'));
    console.log("filename", filename);
    console.log("folderPath", folderPath);
    return `${folderPath}/${filename}`;
};
