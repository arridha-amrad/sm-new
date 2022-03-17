import { FC } from "react";

interface Props {
  previewImages: string[];
}

const CreatePageImagePreview: FC<Props> = ({ previewImages }) => {
  return (
    <>
      {previewImages.length === 1 && (
        <div className=".grid-container-1-col">
          {previewImages.map((image, index) => (
            <img key={index} className="img" src={image} alt="post" />
          ))}
        </div>
      )}

      {previewImages.length === 2 && (
        <div className="grid-container-2-col">
          {previewImages.map((image, index) => {
            if (index === 0) {
              return (
                <div key={index} className="grid-item-1-imgs2">
                  <img className="img" src={image} alt="post" />
                </div>
              );
            }
            return (
              <div key={index} className="grid-item-2-imgs2">
                <img className="img" src={image} alt="post" />
              </div>
            );
          })}
        </div>
      )}

      {previewImages.length === 3 && (
        <div className="grid-container-2-col">
          {previewImages.map((image, index) => {
            if (index === 0) {
              return (
                <div key={index} className="grid-item-1-imgs3">
                  <img className="img" src={image} alt="post" />
                </div>
              );
            }
            if (index === 1) {
              return (
                <div key={index} className="grid-item-2-imgs3">
                  <img className="img" src={image} alt="post" />
                </div>
              );
            }
            return (
              <div key={index} className="grid-item-3-imgs3">
                <img className="img" src={image} alt="post" />
              </div>
            );
          })}
        </div>
      )}

      {previewImages.length === 4 && (
        <div className="grid-container-2-col">
          {previewImages.map((image, index) => (
            <img key={index} className="img" src={image} alt="post" />
          ))}
        </div>
      )}
    </>
  );
};

export default CreatePageImagePreview;
