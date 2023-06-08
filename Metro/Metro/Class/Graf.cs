using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace Metro
{
    public static class Graf
    {
        public static readonly ((SolidColorBrush color, (int x, int y)[] stations)[] lines, (string st1, string st2)[] links)[] inputData = new[]{
            (new[]{
                (Brushes.Red,  new[]{
                (350,600),
                (350,540),
                (350,400),
                (350,350)
            }),
                (Brushes.Blue,  new[]{
                (330, 420),
                (310, 370),
                (300, 350),
                (300, 300),
                (330, 280),
            }),
                (Brushes.Green,  new[]{
                (370, 420),
                (490, 300),
                (370, 280),
            }),
                (Brushes.Yellow,  new[]{
                (350, 250),
                (350, 200),
                (350, 100),
            }),
                (Brushes.Gray,  new[]{
                    (150, 170),
                    (200, 120),
                    (350, 70),
                    (400, 60),
                    (450, 50),
                })
            }, new[]{
                ("l0_s2", "l1_s0"),
                ("l0_s2", "l2_s0"),
                ("l2_s2", "l3_s0"),
                ("l1_s4", "l3_s0"),
                ("l3_s2", "l4_s2"),
                ("l1_s4", "l2_s2")
            }),
            (new[]{
                (Brushes.Red, new[]{
                    (100, 550),
                    (100, 500),
                    (90, 400),
                    (90, 300),
                    (110, 250),
                    (150, 200),
                    (190, 180),
                    (220, 200),
                    (250, 250),
                    (260, 300),
                    (260, 350),
                    (260, 400)
                }),
                (Brushes.Blue, new[]{
                    (40, 215),
                    (50, 320),
                    (105, 320),
                    (190, 320),
                    (275, 320),
                    (330, 300),
                    (390, 255),
                }),
                (Brushes.Orange, new[]{
                    (350, 105),
                    (410, 155),
                    (415, 245),
                    (420, 305),
                    (440, 385),
                }),
                (Brushes.Green, new[]{
                    (50, 510),
                    (120, 520),
                    (200, 550),
                    (240, 570),
                }),
                (Brushes.Gray, new[]{
                    (50, 450),
                    (30, 500),
                    (50, 600),
                }),
                (Brushes.Coral, new[]{
                    (120, 410),
                    (150, 450),
                    (200, 450),
                })
            }, new[]{
                ("l0_s1", "l3_s1"),
                ("l0_s3", "l1_s2"),
                ("l0_s9", "l1_s4"),
                ("l1_s6", "l2_s2"),
                ("l3_s0", "l4_s1"),
                ("l0_s2", "l5_s0"),
            }),
            (new[]{
                (Brushes.Red, new[]{
                    (40, 490),
                      (40, 420),
                      (70, 350),
                      (180, 170),
                      (340, 280),
                      (400, 350),
                      (400, 500),
                      (450, 550),
                }),
                (Brushes.Blue, new[]{
                    (20, 330),
                      (70, 320),
                      (190, 280),
                      (330, 300),
                      (500, 250),
                      (550, 200),
                      (570, 100),
                }),
                (Brushes.Orange, new[]{
                    (20, 100),
                      (70, 100),
                      (180, 130),
                      (350, 150),
                      (480, 230),
                      (430, 350),
                      (300, 500),
                }),
                (Brushes.Green, new[]{
                    (100, 580),
                      (200, 550),
                      (200, 500),
                      (160, 400),
                      (200, 310),
                      (250, 250),
                      (230, 120),
                      (270, 80),
                      (350, 50),
                      (500, 150),
                }),
                (Brushes.Gray, new[]{
                    (50, 150),
                      (220, 210),
                      (310, 280),
                      (400, 570),
                }),
                (Brushes.Brown, new[]{
                    (500, 50),
                      (400, 50),
                      (320, 110),
                      (250, 170),
                      (370, 250),
                      (500, 400),
                }),
                (Brushes.DarkCyan, new[]{
                    (590, 550),
                      (500, 510),
                      (410, 470),
                      (300, 460),
                      (200, 470),
                      (100, 480),
                      (70, 500),
                }),
                (Brushes.DarkRed, new[]{
                    (670, 200),
                      (620, 300),
                      (650, 500),
                      (620, 550),
                      (550, 650),
                })
            }, new[]{
                ("l0_s2", "l1_s1"),
                ("l0_s3", "l2_s2"),
                ("l0_s3", "l3_s6"),
                ("l0_s3", "l4_s1"),
                ("l0_s4", "l1_s3"),
                ("l0_s4", "l4_s2"),
                ("l0_s5", "l2_s5"),
                ("l1_s2", "l3_s4"),
                ("l1_s3", "l4_s2"),
                ("l1_s4", "l2_s4"),
                ("l2_s2", "l3_s6"),
                ("l4_s1", "l3_s6"),
                ("l5_s3", "l3_s6"),
                ("l5_s3", "l4_s1"),
                ("l6_s4", "l3_s2"),
                ("l6_s2", "l0_s6"),
                ("l7_s3", "l6_s0"),
            })
        };
    }
}