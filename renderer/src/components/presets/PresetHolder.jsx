import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PresetOption from "./PresetOption";

const tabs = ["A-Series", "B-Series", "C-Series", "US Sizes"];

const animation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.18, ease: "easeOut" },
};

const PresetHolder = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const tabClasses = (index) =>
    `px-4 py-2 cursor-pointer whitespace-nowrap transition-colors duration-200 border-b-2 border-transparent
     ${currentTab === index ? "text-nero-300 border-b-2 border-white" : "text-nero-400 hover:text-nero-100"}`;

  const renderPreset = (name, w, h) => (
    <PresetOption
      paperName={name}
      width={w}
      height={h}
      selected={selectedPreset === name}
      onSelect={() => setSelectedPreset(name)}
    />
  );

  return (
    <div className="w-full sm:w-[50%] md:w-[60%] lg:w-[67%] xl:w-[72%] h-screen">
      <div className="w-full bg-nero-800 border-b-2 border-r-2 border-nero-900 text-nero-300 text-xl px-4 py-2">
        Presets
      </div>

      {/* Tabs */}
      <div className="bg-nero-800 border-b-2 border-r-2 border-nero-900 minimal-scrollbar overflow-x-auto">
        <div
          className="flex items-center px-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-1 w-max mx-auto lg:mx-auto md:mx-0">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={tabClasses(index)}
              onClick={() => setCurrentTab(index)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>


      {/* CONTENT */}
      <div className="minimal-scrollbar w-full h-[calc(100vh-100px)] overflow-auto flex flex-col relative">
        <AnimatePresence mode="wait">
          {currentTab === 0 && (
            <motion.div
              key="a-series"
              {...animation}
              className="w-full bg-nero-900 text-nero-300 p-2.5 grid grid-cols-[repeat(auto-fit,minmax(162px,1fr))] grid-auto-rows-[162px] gap-2 place-items-center"
            >
              {renderPreset("A0", 841, 1189)}
              {renderPreset("A1", 594, 841)}
              {renderPreset("A2", 420, 594)}
              {renderPreset("A3", 297, 420)}
              {renderPreset("A4", 210, 297)}
              {renderPreset("A5", 148, 210)}
              {renderPreset("A6", 105, 148)}
              {renderPreset("12 x 18", 304.8, 457.2)}
              {renderPreset("13 x 19", 330.2, 482.6)}
              {renderPreset("19 x 13", 482.6, 330.2)}
            </motion.div>
          )}

          {currentTab === 1 && (
            <motion.div
              key="b-series"
              {...animation}
              className="w-full bg-nero-900 text-nero-300 p-2.5 grid grid-cols-[repeat(auto-fit,minmax(162px,1fr))] grid-auto-rows-[162px] gap-2 place-items-center"
            >
              {renderPreset("B0", 1000, 1414)}
              {renderPreset("B1", 707, 1000)}
              {renderPreset("B2", 500, 707)}
              {renderPreset("B3", 353, 500)}
              {renderPreset("B4", 250, 353)}
              {renderPreset("B5", 176, 250)}
              {renderPreset("B6", 125, 176)}
            </motion.div>
          )}

          {currentTab === 2 && (
            <motion.div
              key="c-series"
              {...animation}
              className="w-full bg-nero-900 text-nero-300 p-2.5 grid grid-cols-[repeat(auto-fit,minmax(162px,1fr))] grid-auto-rows-[162px] gap-2 place-items-center"
            >
              {renderPreset("C0", 917, 1297)}
              {renderPreset("C1", 648, 917)}
              {renderPreset("C2", 458, 648)}
              {renderPreset("C3", 324, 458)}
              {renderPreset("C4", 229, 324)}
              {renderPreset("C5", 162, 229)}
              {renderPreset("C6", 114, 162)}
            </motion.div>
          )}

          {currentTab === 3 && (
            <motion.div
              key="us-series"
              {...animation}
              className="w-full bg-nero-900 text-nero-300 p-2.5 grid grid-cols-[repeat(auto-fit,minmax(162px,1fr))] grid-auto-rows-[162px] gap-2 place-items-center"
            >
              {renderPreset("Letter", 216, 279)}
              {renderPreset("Legal", 216, 356)}
              {renderPreset("Tabloid", 279, 432)}
              {renderPreset("Ledger", 279.4, 431.8)}
              {renderPreset("Junior Legal", 127, 203)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PresetHolder;
