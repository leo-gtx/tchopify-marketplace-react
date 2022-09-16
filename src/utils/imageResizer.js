import Resizer from "react-image-file-resizer";

export const resizeFileRestaurant = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      500,
      500,
      "JPEG",
      90,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

  export const resizeFileDish = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      800,
      656,
      "JPEG",
      90,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

  export const resizeThumbnail = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      200,
      200,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });