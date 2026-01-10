import { useEffect, useState } from "react";
import { useLayout } from "../../../context/LayoutProvider";
import { useRefresh } from "../../../context/RefreshContext";
import UnitSelector from "./UnitSelector";
import SizeInput from "./SizeInput";

const SizeConfigPanel = () => {
    const layout = useLayout();
    const { handleRefresh } = useRefresh();

    const mmToPt = (mm) => mm * 2.8346456693;
    const ptToMm = (pt) => pt / 2.8346456693;
    const inToPt = (inch) => inch * 72;

    // CLEAN FORMATTER — removes unnecessary decimals
    const cleanNumber = (num) => {
        if (num == null || isNaN(num)) return "0";
        const rounded = parseFloat(num.toFixed(2));
        return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
    };

    // PURE INPUTS
    const [paperWidthInput, setPaperWidthInput] = useState("");
    const [paperHeightInput, setPaperHeightInput] = useState("");
    const [couponWidthInput, setCouponWidthInput] = useState("");
    const [couponHeightInput, setCouponHeightInput] = useState("");

    // Sync initial values
    useEffect(() => {
        setPaperWidthInput("0");
        setPaperHeightInput("0");
        setCouponWidthInput("0");
        setCouponHeightInput("0");
    }, []);

    // Sync values when preset updates
    useEffect(() => {
        if (!layout.values.presetUpdate) return;

        setPaperWidthInput(
            cleanNumber(ptToMm(layout.values.paperWidthPt))
        );
        setPaperHeightInput(
            cleanNumber(ptToMm(layout.values.paperHeightPt))
        );

        layout.set.setPresetUpdate(false);
    }, [
        layout.values.paperWidthPt,
        layout.values.paperHeightPt,
        layout.values.presetUpdate
    ]);

    useEffect(() => {
        const { paperWidthPt, paperHeightPt, paperUnit } = layout.values;

        const toDisplay = (pt) =>
            paperUnit === "mm"
                ? cleanNumber(ptToMm(pt))
                : cleanNumber(pt / 72);

        setPaperWidthInput(toDisplay(paperWidthPt));
        setPaperHeightInput(toDisplay(paperHeightPt));
    }, [
        layout.values.paperUnit,
        layout.values.paperWidthPt,
        layout.values.paperHeightPt,
    ]);



    // ---------------------------
    // INPUT HANDLERS
    // ---------------------------
    const handlePaperWidthChange = (val) => {
        setPaperWidthInput(val);

        if (val === "") return; // 👈 allow empty while typing

        const n = Number(val);
        if (isNaN(n)) return;

        layout.set.setPaperWidthPt(
            layout.values.paperUnit === "mm" ? mmToPt(n) : inToPt(n)
        );
    };


    const handlePaperHeightChange = (val) => {
        setPaperHeightInput(val);
        const n = Number(val);
        if (!isNaN(n)) {
            layout.set.setPaperHeightPt(
                layout.values.paperUnit === "mm" ? mmToPt(n) : inToPt(n)
            );
        }
        handleRefresh();
    };

    const handleCouponWidthChange = (val) => {
        setCouponWidthInput(val);
        const n = Number(val);
        if (!isNaN(n)) {
            const pt = layout.values.couponUnit === "mm" ? mmToPt(n) : inToPt(n);
            layout.set.setCouponWidthPt(pt);
            layout.set.setFontScale(pt / 120);
        }
        handleRefresh();
    };

    const handleCouponHeightChange = (val) => {
        setCouponHeightInput(val);
        const n = Number(val);
        if (!isNaN(n)) {
            const pt = layout.values.couponUnit === "mm" ? mmToPt(n) : inToPt(n);
            layout.set.setCouponHeightPt(pt);
        }
        handleRefresh();
    };

    // UNIT SWITCHERS
    const handlePaperUnitChange = (newUnit) => {
        layout.set.setPaperUnit(newUnit);

        const w = Number(paperWidthInput);
        const h = Number(paperHeightInput);

        if (!isNaN(w))
            layout.set.setPaperWidthPt(newUnit === "mm" ? mmToPt(w) : inToPt(w));

        if (!isNaN(h))
            layout.set.setPaperHeightPt(newUnit === "mm" ? mmToPt(h) : inToPt(h));

        handleRefresh();
    };

    const handleCouponUnitChange = (newUnit) => {
        layout.set.setCouponUnit(newUnit);

        const w = Number(couponWidthInput);
        const h = Number(couponHeightInput);

        if (!isNaN(w)) {
            const pt = newUnit === "mm" ? mmToPt(w) : inToPt(w);
            layout.set.setCouponWidthPt(pt);
            layout.set.setFontScale(pt / 120);
        }

        if (!isNaN(h)) {
            layout.set.setCouponHeightPt(newUnit === "mm" ? mmToPt(h) : inToPt(h));
        }

        handleRefresh();
    };

    return (
        <div className="w-full flex flex-col gap-4 p-2.5 border-b-2 bg-nero-800 border-nero-900">

            <div className="flex flex-col gap-1">
                <h2 className="text-lg text-nero-400 font-medium">Page Size</h2>

                <div className="w-full flex items-center gap-2">
                    <SizeInput
                        label="Width"
                        value={paperWidthInput}
                        onValueChange={handlePaperWidthChange}
                    />
                    <SizeInput
                        label="Height"
                        value={paperHeightInput}
                        onValueChange={handlePaperHeightChange}
                    />
                    <UnitSelector
                        value={layout.values.paperUnit}
                        onChange={handlePaperUnitChange}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <h2 className="text-lg text-nero-400 font-medium">Label Size</h2>

                <div className="w-full flex items-center gap-2">
                    <SizeInput
                        label="Width"
                        value={couponWidthInput}
                        onValueChange={handleCouponWidthChange}
                    />
                    <SizeInput
                        label="Height"
                        value={couponHeightInput}
                        onValueChange={handleCouponHeightChange}
                    />
                    <UnitSelector
                        value={layout.values.couponUnit}
                        onChange={handleCouponUnitChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default SizeConfigPanel;
