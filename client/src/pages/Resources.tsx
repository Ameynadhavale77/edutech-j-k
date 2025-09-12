import { useLanguage } from "@/components/LanguageSwitcher";
import { getTranslation } from "@/lib/translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Calendar, Users, Trophy, AlertCircle, CheckCircle, Download } from "lucide-react";

export default function Resources() {
  const currentLanguage = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-24 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="text-resources-title">
            {getTranslation("resources", currentLanguage)}
          </h1>
          <p className="text-muted-foreground" data-testid="text-resources-description">
            {getTranslation("resourcesDescription", currentLanguage)}
          </p>
        </div>

        <div className="grid gap-8">
          {/* JKCET Section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                JKCET - Jammu & Kashmir Common Entrance Test
              </CardTitle>
              <CardDescription>
                Complete guide for engineering entrance exam in J&K
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">{getTranslation("examDetails", currentLanguage)}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{getTranslation("conductingBody", currentLanguage)}:</span>
                      <span>JKBOPEE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{getTranslation("mode", currentLanguage)}:</span>
                      <span>Offline (OMR-based)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{getTranslation("frequency", currentLanguage)}:</span>
                      <span>Once a year (April-May)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{getTranslation("forAdmission", currentLanguage)}:</span>
                      <span>B.E./B.Tech courses</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">{getTranslation("eligibility", currentLanguage)}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Must be permanent resident of J&K or Ladakh</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Passed 10+2 with PCM</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>50% marks (General), 45% (Reserved)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Minimum 17 years age</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Exam Pattern */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Exam Pattern</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border rounded-lg">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border border-border p-3 text-left">Subject</th>
                        <th className="border border-border p-3 text-center">Questions</th>
                        <th className="border border-border p-3 text-center">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3">Physics</td>
                        <td className="border border-border p-3 text-center">60</td>
                        <td className="border border-border p-3 text-center">60</td>
                      </tr>
                      <tr className="bg-muted/25">
                        <td className="border border-border p-3">Chemistry</td>
                        <td className="border border-border p-3 text-center">60</td>
                        <td className="border border-border p-3 text-center">60</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">Mathematics</td>
                        <td className="border border-border p-3 text-center">60</td>
                        <td className="border border-border p-3 text-center">60</td>
                      </tr>
                      <tr className="bg-primary/10 font-semibold">
                        <td className="border border-border p-3">Total</td>
                        <td className="border border-border p-3 text-center">180</td>
                        <td className="border border-border p-3 text-center">180</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator />

              {/* Marking Scheme */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Marking Scheme</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Correct: +1
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Wrong: -0.25
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      Unanswered: 0
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cutoff & Preparation */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Cutoff Trends</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>General Category:</span>
                      <Badge variant="outline">70-110 marks</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Reserved Categories:</span>
                      <Badge variant="outline">55-80 marks</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Top colleges require rank 500-800
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Key Preparation Tips</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>Focus on NCERT (70-80% questions)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>Solve last 5-10 years papers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>Practice 3-hour mock tests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>Emphasize Class 12 syllabus</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* JEE Section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                JEE - Joint Entrance Examination
              </CardTitle>
              <CardDescription>
                National level engineering entrance exam guide for J&K students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Exam Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Conducting Body:</span>
                      <span>NTA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Mode:</span>
                      <span>Online (CBT)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Frequency:</span>
                      <span>Twice a year (Jan & Apr)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">For Admission:</span>
                      <span>NITs, IIITs, GFTIs, IITs</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Eligibility for J&K</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Passed 10+2 (PCM) from recognized board</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>75% in 12th (General), 65% (Reserved)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>3 consecutive years (6 attempts)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>No domicile restriction for JEE</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* JEE Main Pattern */}
              <div>
                <h3 className="font-semibold text-lg mb-3">JEE Main Pattern</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border rounded-lg">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border border-border p-3 text-left">Subject</th>
                        <th className="border border-border p-3 text-center">Questions</th>
                        <th className="border border-border p-3 text-center">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3">Physics</td>
                        <td className="border border-border p-3 text-center">30</td>
                        <td className="border border-border p-3 text-center">100</td>
                      </tr>
                      <tr className="bg-muted/25">
                        <td className="border border-border p-3">Chemistry</td>
                        <td className="border border-border p-3 text-center">30</td>
                        <td className="border border-border p-3 text-center">100</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">Mathematics</td>
                        <td className="border border-border p-3 text-center">30</td>
                        <td className="border border-border p-3 text-center">100</td>
                      </tr>
                      <tr className="bg-primary/10 font-semibold">
                        <td className="border border-border p-3">Total</td>
                        <td className="border border-border p-3 text-center">90</td>
                        <td className="border border-border p-3 text-center">300</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator />

              {/* JEE Marking */}
              <div>
                <h3 className="font-semibold text-lg mb-3">JEE Main Marking</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Correct: +4
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Wrong: -1
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      Unanswered: 0
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cutoff & Resources */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">NIT Srinagar Cutoffs (2024)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>CSE:</span>
                      <Badge variant="outline">92-94 percentile</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>ECE:</span>
                      <Badge variant="outline">85-88 percentile</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Mechanical:</span>
                      <Badge variant="outline">75-80 percentile</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Civil:</span>
                      <Badge variant="outline">70-75 percentile</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Recommended Books</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Physics:</span>
                      <span className="ml-2 text-muted-foreground">H.C. Verma, D.C. Pandey</span>
                    </div>
                    <div>
                      <span className="font-medium">Chemistry:</span>
                      <span className="ml-2 text-muted-foreground">NCERT, O.P. Tandon</span>
                    </div>
                    <div>
                      <span className="font-medium">Maths:</span>
                      <span className="ml-2 text-muted-foreground">R.D. Sharma, Cengage</span>
                    </div>
                    <div className="mt-3">
                      <span className="font-medium">Online:</span>
                      <span className="ml-2 text-muted-foreground">Physics Wallah, Unacademy</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Download Materials Section */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Download Study Materials
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-base">Question Papers & Solutions</h4>
                    <div className="space-y-2">
                      <a
                        href="/resources/JEE-Physics-2024-Question-Papers.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors text-sm"
                      >
                        <Download className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                          <div className="font-medium">JEE Physics 2024</div>
                          <div className="text-muted-foreground text-xs">Question Papers with Answer Key</div>
                        </div>
                      </a>
                      <a
                        href="/resources/JEE-Chemistry-2024-Question-Papers.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors text-sm"
                      >
                        <Download className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                          <div className="font-medium">JEE Chemistry 2024</div>
                          <div className="text-muted-foreground text-xs">Question Papers with Answer Key</div>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-base">Latest Papers (2025)</h4>
                    <div className="space-y-2">
                      <a
                        href="/resources/JEE-Main-2025-Question-Paper-Solution.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors text-sm"
                      >
                        <Download className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                          <div className="font-medium">JEE Main 2025 Paper</div>
                          <div className="text-muted-foreground text-xs">22 Jan Shift-1 with Solutions</div>
                        </div>
                      </a>
                      <a
                        href="/resources/JEE-Main-2025-Answer-Key.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors text-sm"
                      >
                        <Download className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                          <div className="font-medium">JEE Main 2025 Answer Key</div>
                          <div className="text-muted-foreground text-xs">Official Answer Key</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> These are previous year papers and official answer keys. Practice regularly and analyze your performance to improve your JEE preparation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}