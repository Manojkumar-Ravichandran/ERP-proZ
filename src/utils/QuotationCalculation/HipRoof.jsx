import { count, find } from "rsuite/esm/internals/utils/ReactChildren";
import { calculateBottomBaseArea,calculateRectangleScrews,calculateTriangleLines,calculateTriangleScrews,findRoofVerticalHeight, rectangleArea, trapezoidArea, triangleArea } from "./GeneralCal";
import { roofMaterial } from "../../contents/Qutoation/RoofData";


function validatePayload(payload) {
  if (!payload || !payload.width || !payload.length) {
    console.error("Invalid payload", payload);
    return false;
  }
  return true;
}

export function HipRoofCalculation(payload) {
  if (!validatePayload(payload)) return;

  

  const width = Number(payload.width);
  const length = Number(payload.length);

  const bottomBaseArea = calculateBottomBaseArea(width, length);

  
  

  const findLeftAngleTriangleHypotenuse = findRoofVerticalHeight(width/2, width/2, 90);
  

  const trapizodeArea = trapezoidArea((length-width),length, width/2);
  
  const leftTriangleTopRods = calculateTriangleLines( width/2, width/2,findLeftAngleTriangleHypotenuse);
  
  const leftTriangleTopRodsCount = Math.ceil(leftTriangleTopRods/roofMaterial[1]?.length);
  
  const oneSideTriangleHorizontalRods = Math.ceil(((Math.ceil(length-width/2))*2)/roofMaterial[1]?.length);
  

  const totalSubRods = (leftTriangleTopRodsCount*4)+(oneSideTriangleHorizontalRods*2);
  

  const hipSideTrianlge = calculateTriangleLines(width, findLeftAngleTriangleHypotenuse, findLeftAngleTriangleHypotenuse);
  
  const hipSideTriangleRodCount = Math.ceil(hipSideTrianlge/roofMaterial[1]?.length)*2;
  

  const MainRodCount = ((findLeftAngleTriangleHypotenuse*4)+(length-width))/roofMaterial[1]?.length;
  

  const totalRodCount = Math.ceil(totalSubRods+hipSideTriangleRodCount+MainRodCount);
  

  const triangleScrew=calculateTriangleScrews(width/2, width/2);
  
  const sideTriangleScrew = calculateTriangleScrews(width, findLeftAngleTriangleHypotenuse);
  

  const rectangleScrewCount = Math.ceil(calculateRectangleScrews(length-width, width/2));
  

  const totalScrewCount = Math.ceil((triangleScrew*4)+(sideTriangleScrew*2)+(rectangleScrewCount*2));
  

  const totalHCupCount  = Math.ceil((Math.ceil((length-width)/roofMaterial[3]?.length))+(Math.ceil(findLeftAngleTriangleHypotenuse/roofMaterial[3]?.length)*4));
  

  const roofAreaCal =rectangleArea(roofMaterial[0]?.length,roofMaterial[0]?.width);
  

  const sheetCount = (Math.ceil((trapizodeArea/roofAreaCal)*2) + Math.ceil(triangleArea(width, findLeftAngleTriangleHypotenuse, findLeftAngleTriangleHypotenuse)/roofAreaCal)*4);
  

  const totalSheetCount = (sheetCount + (Math.ceil(sheetCount/roofMaterial[0]?.length)));
  

  const antiDustTapCount = Math.ceil(((length*2)/roofMaterial[5]?.length));
  const sealingTapCount = Math.ceil(((length*2)/roofMaterial[6]?.length));

  
  

  const pillarLengthCount = Math.ceil(length/10)+1;
  

  const pillarWidthCount = Math.ceil(width/10)+1;
  

  const totalPillarCount = Math.ceil(((pillarLengthCount +pillarWidthCount)*(payload?.height+3)/roofMaterial[7]?.length));

  

  const result = [
     {
      bottomBaseArea: bottomBaseArea,
      bottomWidth: width,
      bottomLength: length,
      area: rectangleArea(width,length)
    },
     { 
      ...roofMaterial[0],
      count: totalSheetCount,
      width: roofMaterial[0]?.width,
      length: roofMaterial[0]?.length,
      total:roofMaterial[0]?.price *totalSheetCount
     },
     {
        ...roofMaterial[1],
        count: totalRodCount,
        length: roofMaterial[1]?.length,
        total:roofMaterial[1]?.price *totalRodCount

     },
     { 
      ...roofMaterial[3],
 
        count: 2,
        length: roofMaterial[3]?.length,
        total:roofMaterial[3]?.price *2

     },
      {
        ...roofMaterial[2],

          count: totalScrewCount,
          total:roofMaterial[2]?.price *totalScrewCount

      },
       {
        ...roofMaterial[5],
        count: antiDustTapCount,
        total:roofMaterial[5]?.price *antiDustTapCount
      },
       {
        ...roofMaterial[6],
        count: sealingTapCount,
        total:roofMaterial[6]?.price *sealingTapCount

      },
      {
        ...roofMaterial[7],
        count: totalPillarCount,
        length: roofMaterial[7]?.length,
        total:roofMaterial[7]?.price *totalPillarCount

      },
      {
        ...roofMaterial[3],
        count:totalHCupCount,
        length:roofMaterial[3]?.length,
        total:roofMaterial[3]?.price *totalHCupCount

      }

   

    ];

  console.log("result", result)
  return result
}
