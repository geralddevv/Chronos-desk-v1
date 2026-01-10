// components/TokenTemplate.jsx
import { View, Text, Image, Font } from "@react-pdf/renderer";
import logo from "../assets/brand-logo.jpg";
// import staticQr from "../assets/static-qr.png";`
import TechUseTxt from "../assets/tech-use.png";

// FONT REGISTRATION MOVED HERE
let fontsRegistered = false;

if (!fontsRegistered) {
  Font.register({
    family: "Montserrat",
    fonts: [
      {
        src: new URL(
          "../assets/fonts/montserrat/Montserrat-Light.ttf",
          import.meta.url
        ).href,
        fontWeight: 300,
      },
      {
        src: new URL(
          "../assets/fonts/montserrat/Montserrat-Regular.ttf",
          import.meta.url
        ).href,
        fontWeight: 400,
      },
      {
        src: new URL(
          "../assets/fonts/montserrat/Montserrat-SemiBold.ttf",
          import.meta.url
        ).href,
        fontWeight: 600,
      },
      {
        src: new URL(
          "../assets/fonts/montserrat/Montserrat-SemiBoldItalic.ttf",
          import.meta.url
        ).href,
        fontWeight: 600,
        fontStyle: "italic",
      },
      {
        src: new URL(
          "../assets/fonts/montserrat/Montserrat-Bold.ttf",
          import.meta.url
        ).href,
        fontWeight: 700,
      },
    ],
  });


  fontsRegistered = true;
}

const wrapTextByWords = (text = "", maxCharsPerLine = 14) => {
  if (!text) return "";

  const words = text.trim().split(/\s+/); // handles multiple spaces
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    // If current line is empty, start with the word
    if (!currentLine) {
      currentLine = word;
      continue;
    }

    // Try adding word to current line
    const nextLine = `${currentLine} ${word}`;

    if (nextLine.length <= maxCharsPerLine) {
      currentLine = nextLine;
    } else {
      // Push only if currentLine has content
      lines.push(currentLine);

      // VERY long single word safeguard (rare, but safe)
      currentLine =
        word.length > maxCharsPerLine
          ? word // keep as-is, don't split unless forced
          : word;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines.join("\n");
};



const TokenTemplate = ({
  coupon,
  qrCode,
  internalQr,
  couponWidthPt,
  couponHeightPt,
  fontSize,
}) => {
  const headingSize = fontSize * 1.27;
  const smallText = fontSize * 0.89;
  const italicLabel = fontSize * 0.91;
  const valueSize = fontSize * 0.91;

  return (
    <View
      wrap={false}
      style={{
        width: couponWidthPt,
        height: couponHeightPt,
        padding: 5,
        paddingTop: 6 + 2.835,   // +1mm from top
        paddingRight: 5 + 2.835,
        paddingBottom: 8 - 2.835,
        alignItems: "center",
        justifyContent: "flex-start",
        // borderWidth: 0.75,
        // borderTopWidth: 2,
        // borderBottomWidth: 2,
        borderColor: "#000",
        display: "flex",
      }}
    >
      <Image src={logo} style={{ width: "70%", marginBottom: 4 }} />

      <Text
        style={{
          fontFamily: "Montserrat",
          fontWeight: 600,
          fontSize: headingSize,
          marginBottom: 4,
          paddingLeft: 1.8,
          textAlign: "left",
          width: "100%",
        }}
      >
        Scratch and scan for cashback
      </Text>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "92%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {qrCode && (
            <Image src={qrCode} style={{ width: "96%", margin: 0, padding: 0 }} />
          )}
        </View>

        <View
          style={{
            width: "8%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Image src={TechUseTxt} style={{ width: "60%", margin: 0, padding: 0 }} />
        </View>
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          marginTop: 4,
          flex: 1,
        }}
      >
        <View
          style={{
            width: "50%",
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: 3,
            paddingLeft: 2,
            gap: 1,
            marginRight: 1,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: 600,
              fontSize: smallText,
            }}
          >
            *For Internal use only
          </Text>

          {internalQr && (
            <Image src={internalQr} style={{ width: "100%" }} />
          )}
        </View>

        <View
          style={{
            width: "50%",
            height: "100%",
            paddingLeft: 4,
            paddingRight: 0,
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 3.5,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: 700,
              fontSize: valueSize,
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat",
                fontWeight: 600,
                fontStyle: "italic",
                fontSize: italicLabel,
              }}
            >
              SKU Code
            </Text>
            {"\n"}
            <Text>
              {(coupon?.["Product Code"] || "").slice(0, 8)}
              {"\n"}
              {(coupon?.["Product Code"] || "").slice(8)}
            </Text>
          </Text>

          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: 700,
              fontSize: valueSize,
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat",
                fontWeight: 600,
                fontStyle: "italic",
                fontSize: italicLabel,
              }}
            >
              SKU Name
            </Text>
            {"\n"}
            {wrapTextByWords(coupon?.["Product Description"], 14)}
          </Text>

          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: 700,
              fontSize: valueSize,
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat",
                fontWeight: 600,
                fontStyle: "italic",
                fontSize: italicLabel,
              }}
            >
              Internal Code
            </Text>
            {"\n"}
            <Text>
              {(coupon?.["Internal Code"] || "").slice(0, 13)}
              {"\n"}
              {(coupon?.["Internal Code"] || "").slice(13)}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TokenTemplate;
