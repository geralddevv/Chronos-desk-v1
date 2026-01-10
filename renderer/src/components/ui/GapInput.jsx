import { useLayout } from "../../context/LayoutProvider";
import { useRefresh } from "../../context/RefreshContext";

/**
 * Convert mm → pt
 * 1 mm = 2.834645669 pt
 */
const MM_TO_PT = 2.834645669;

const mmToPt = (mm) => Number((mm * MM_TO_PT).toFixed(3));
const ptToMm = (pt) => Number((pt / MM_TO_PT).toFixed(2));

const GapInput = () => {
    const {
        values: { gapXPt, gapYPt },
        set: { setGapXPt, setGapYPt },
    } = useLayout();

    const { handleRefresh } = useRefresh();

    // pt → mm for UI
    const gapXmm = gapXPt == null ? "" : ptToMm(gapXPt);
    const gapYmm = gapYPt == null ? "" : ptToMm(gapYPt);

    const handleGapXChange = (value) => {
        if (value === "") {
            setGapXPt(null);
            setGapYPt(null); // Y follows X
            return;
        }

        const mm = Number(value);
        if (Number.isNaN(mm)) return;

        const pt = mmToPt(mm);

        setGapXPt(pt);
        setGapYPt(pt); // sync Y with X
        handleRefresh();
    };



    const handleGapYChange = (value) => {
        if (value === "") {
            setGapYPt(null);
            return;
        }

        const mm = Number(value);
        if (Number.isNaN(mm)) return;

        setGapYPt(mmToPt(mm));
        handleRefresh();
    };


    return (
        <>
            {/* GAP X */}
            <div className="w-full flex">
                <div className="w-[60%] h-8 flex items-center justify-center bg-nero-750 border border-nero-600 border-r-0 text-sm rounded-bl-md rounded-tl-md">
                    Gap X
                </div>

                <input
                    type="number"
                    value={gapXmm}
                    onChange={(e) => handleGapXChange(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => {
                        if (e.target.value === "") handleGapXChange("0");
                    }}
                    className="no-spinner w-[40%] h-8 px-2 py-1 bg-nero-700 rounded-md rounded-l-none border border-nero-600 text-sm"
                />
            </div>

            {/* GAP Y */}
            <div className="w-full flex">
                <div className="w-[60%] h-8 flex items-center justify-center bg-nero-750 border border-nero-600 border-r-0 text-sm rounded-bl-md rounded-tl-md">
                    Gap Y
                </div>

                <input
                    type="number"
                    value={gapYmm}
                    onChange={(e) => handleGapYChange(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => {
                        if (e.target.value === "") handleGapYChange("0");
                    }}
                    className="no-spinner w-[40%] h-8 px-2 py-1 bg-nero-700 rounded-md rounded-l-none border border-nero-600 text-sm"
                />
            </div>
        </>
    );
};

export default GapInput;
