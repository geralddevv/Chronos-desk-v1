import RefreshBtn from "../ui/RefreshBtn";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useLayout } from "../../context/LayoutProvider";
import GapInput from "./GapInput";
import { useRefresh } from "../../context/RefreshContext";

const Orientation = () => {
  const {
    values: { paperWidthPt, paperHeightPt, orientation },
    set: { setPaperWidthPt, setPaperHeightPt, setOrientation }
  } = useLayout();

  const { handleRefresh } = useRefresh();

  // Swap width & height when orientation changes
  const handleOrientationChange = (value) => {
    // If user picks the same orientation → do nothing
    if (value === orientation) return;

    // Swap paper size
    setPaperWidthPt(paperHeightPt);
    setPaperHeightPt(paperWidthPt);

    // Update orientation state
    setOrientation(value);

    // Refresh everything (reset inputs, PDF regenerate, clear file input, etc.)
    handleRefresh();
  };

  return (
    <div className="w-full p-2.5 flex justify-center items-center gap-2 border-b-2 bg-nero-800 border-nero-900">
      <div className="w-[30%] flex">
          {/* Label */}
          {/* <div className="h-8 bg-nero-750 border border-nero-600 border-r-0 px-2 py-1 flex flex-col justify-center items-center rounded-bl-md rounded-tl-md">
            <span className="text-sm">Orientation</span>
          </div> */}

          <select
            className="appearance-none w-full h-8 px-2 py-1 bg-nero-700 rounded-md border border-nero-600 text-sm text-nero-200 text-center focus:outline-none cursor-pointer"
            value={orientation}
            onChange={(e) => handleOrientationChange(e.target.value)}
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>

            {/* Custom Arrow */}
            {/* <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-nero-300 text-xs">
              <KeyboardArrowDownIcon className="text-nero-400" />
            </span> */}
      </div>

      <div className="w-[70%] h-8 flex gap-2">
        <GapInput />
      </div>

      {/* Refresh button - already present */}
      <div className="w-[10%] h-8 flex">
        <RefreshBtn />
      </div>
    </div>
  );
};

export default Orientation;