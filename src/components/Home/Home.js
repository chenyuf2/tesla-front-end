import clsx from "clsx";
import styles from "./Home.module.scss";
import { importAll, parseImageName } from "utils/utilFn";
import csvFile from "static/labels/train_labels.csv";
import { useEffect, useState } from "react";
import { parse } from "papaparse";
import ImageBlock from "components/ImageBlock/ImageBlock";
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "components/ImageBlock/ImageBlock";

const TRAIN_IMAGES = importAll(
  require.context(
    "../../static/images/train_images",
    false,
    /\.(png|jpe?g|svg)$/
  )
);

const TEST_IMAGES = importAll(
  require.context(
    "../../static/images/train_images",
    false,
    /\.(png|jpe?g|svg)$/
  )
);

const IMAGES = [
  ...TEST_IMAGES.map((url) => ({ url, type: "Test" })),
  ...TRAIN_IMAGES.map((url) => ({ url, type: "Train" })),
];

const Home = () => {
  const [labelData, setLabelData] = useState([]);
  const imageLabelSet = getImageLabelSet();
  const [selectedLabel, setSelectedLabel] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  useEffect(() => {
    const data = [];
    parse(csvFile, {
      download: true,
      step: function (row) {
        data.push(row.data);
      },
      complete: function () {
        const dataMap = data.slice(1).reduce((prev, item) => {
          prev[item[0].substring(0, 14)] = {
            name: item[0],
            top: item[1],
            left: item[2],
            width: item[3],
            height: item[4],
            label: item[5],
          };
          return prev;
        }, {});
        setLabelData(dataMap);
      },
    });
  }, []);

  function getImageLabelSet() {
    return Object.values(labelData).reduce((prev, item) => {
      prev.add(item.label);
      return prev;
    }, new Set());
  }

  const calculateImageLabelPosByURL = (url) => {
    const imageName = parseImageName(url);
    const imageLabelInfo = labelData[imageName];

    const topPercent = (+imageLabelInfo?.top * 100) / IMAGE_HEIGHT || 0;
    const leftPercent = (+imageLabelInfo?.left * 100) / IMAGE_WIDTH || 0;
    const widthPercent = (+imageLabelInfo?.width * 100) / IMAGE_WIDTH || 0;
    const heightPercent = (+imageLabelInfo?.height * 100) / IMAGE_HEIGHT || 0;
    return imageLabelInfo && topPercent < 100 && leftPercent < 100
      ? {
          label: imageLabelInfo.label,
          topPercent,
          leftPercent,
          widthPercent,
          heightPercent,
        }
      : null;
  };
  return (
    <>
      <section className={styles["title-container"]}>
        <div className="text-center MN-font fw-light fs-6">STEPHEN</div>
        <div className={clsx("text-center MN-font", styles["title"])}>
          FRONT END ASSESSMENT
        </div>
      </section>
      <section className={styles["filter-container"]}>
        <div className="d-flex justify-content-end flex-wrap">
          <div className="d-flex align-items-center p-4">
            <div className="Gotham-font-medium">Image Type: </div>
            <select
              className={clsx("ms-3 p-2", styles["select-container"])}
              aria-label="Filter by image type"
              placeholder="Select Image Type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Test">Test</option>
              <option value="Train">Train</option>
            </select>
          </div>
          <div className="d-flex align-items-center p-4">
            <div className="Gotham-font-medium">Label Tag: </div>
            <select
              className={clsx("ms-3 p-2", styles["select-container"])}
              aria-label="Filter by label tag"
              placeholder="Select Label Tag"
              value={selectedLabel}
              onChange={(e) => setSelectedLabel(e.target.value)}
            >
              <option value="all">All Labels</option>
              {Array.from(imageLabelSet)
                .sort()
                .map((label) => (
                  <option value={label} key={label}>
                    {label}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </section>
      <section className="p-4">
        <div className="row">
          {IMAGES.filter(({ url, type }) => {
            const imageLabelInfo = calculateImageLabelPosByURL(url);
            const isSelectedLabel =
              selectedLabel === "all" ||
              (imageLabelInfo &&
                imageLabelInfo.label.toLowerCase() ===
                  selectedLabel.toLowerCase());
            const isSelectedType =
              selectedType === "all" || type === selectedType;
            return isSelectedLabel && isSelectedType;
          })
            .sort((image1, image2) => image1.url.localeCompare(image2.url))
            .map(({ url, type }, index) => {
              const imageLabelInfo = calculateImageLabelPosByURL(url);
              return (
                <ImageBlock
                  key={url + type + index}
                  url={url}
                  type={type}
                  imageLabelInfo={imageLabelInfo}
                />
              );
            })}
        </div>
      </section>
    </>
  );
};

export default Home;
