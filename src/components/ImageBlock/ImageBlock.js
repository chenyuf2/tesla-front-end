import clsx from "clsx";
import { parseImageName } from "utils/utilFn";
import styles from "./ImageBlock.module.scss";

export const IMAGE_WIDTH = 1280;
export const IMAGE_HEIGHT = 720;
const ImageBlock = ({ url, type, imageLabelInfo }) => {
  return (
    <div className="col-xxl-3 col-xl-4 col-lg-6 col-sm-12 p-4 mt-5">
      <div className="position-relative">
        <img src={url} alt="train" className="w-100" />
        {imageLabelInfo && (
          <div
            className="position-absolute"
            style={{ top: 0, bottom: 0, left: 0, right: 0 }}
          >
            <div
              className={clsx(styles["label-rectangle"], "position-absolute")}
              style={{
                top: `${imageLabelInfo.topPercent}%`,
                left: `${imageLabelInfo.leftPercent}%`,
                width: `${imageLabelInfo.widthPercent}%`,
                height: `${imageLabelInfo.heightPercent}%`,
              }}
            />
            <div
              className="position-absolute text-danger fw-bold"
              style={{
                top: `${
                  imageLabelInfo.topPercent + imageLabelInfo.heightPercent
                }%`,
                left: `${imageLabelInfo.leftPercent}%`,
              }}
            >
              {imageLabelInfo.label}
            </div>
          </div>
        )}
      </div>
      <div className="mt-2">
        <div className="Gotham-font-medium">{parseImageName(url)}</div>
        <div className="text-secondary" style={{ fontSize: 12 }}>
          {type} Image
        </div>
      </div>
    </div>
  );
};

export default ImageBlock;
