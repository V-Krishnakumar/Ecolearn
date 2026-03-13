import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export function Certificate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { profile } = useUser();

  const generateCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match template
    canvas.width = 1086; // width of your uploaded template
    canvas.height = 768; // height of your uploaded template

    // Load the uploaded PNG as background
    const img = new Image();
    img.src = "/Eco-Warrior-Certificate.png"; // put your PNG in public/ folder
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Add username
      ctx.font = "bold 40px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(profile?.username || "Student Name", canvas.width / 2, 380);

      // Add current date (bottom right)
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      ctx.font = "18px Arial";
      ctx.textAlign = "left";
      ctx.fillText(currentDate, canvas.width - 260, canvas.height - 116);
    };
  };

  useEffect(() => {
    generateCertificate();
  }, [profile]);

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `Eco-Warrior-Certificate-${
      profile?.username || "Student"
    }-${new Date().toISOString().split("T")[0]}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🌱 Eco Warrior Certificate
            </h1>
            <p className="text-lg text-gray-600">
              Download your personalized certificate of completion
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            {/* Certificate Preview */}
            <div className="border-4 border-green-200 rounded-lg p-4 bg-white shadow-lg">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto"
                style={{ maxWidth: "600px", height: "auto" }}
              />
            </div>

            {/* Download Button */}
            <Button
              onClick={downloadCertificate}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="w-6 h-6 mr-2" />
              Download Certificate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
