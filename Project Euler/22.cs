using System;
using System.IO;

class dkafldjaf
{
	const string intensityFile = "names.txt"; 
	static void Main()
	{
		int sum = 0;
		string s = "";
		using( StreamReader sr = new StreamReader(intensityFile))
		{
			s = sr.ReadLine();
		}
		char[] a = s.ToCharArray();
		string[] names = s.Split(',');
		for (int i = 0 ; i<names.Length ; i++)
		{
			names[i]=names[i].Trim('"');
		}
		char[][] b = new char[names.Length][];
		for ( int i = 0 ; i<names.Length ; i++)
		{
			b[i] = names[i].ToCharArray();
		}
		char[][] c = new char[names.Length][];
		
		for (int i = 0 ; i<names.Length ; i++)
		{
			int ww = 0;
			for (int j = 0 ; j<names.Length ; j++)
			{
				for (int k = 0 ; k<b[i].Length ; k++)
				{
					//Console.WriteLine(Convert.ToInt32(b[i][k]));
					if (k==b[j].Length)
					{
						ww++;
						break;
					}
					if (Convert.ToInt32(b[i][k])>Convert.ToInt32(b[j][k]))
					{
						ww++;
						break;
					}else if (Convert.ToInt32(b[i][k])<Convert.ToInt32(b[j][k])) {
						break;
					}
				}
			}
			c[ww]=new char[b[i].Length];
			Console.WriteLine("asdfsadf "+ww);
			for (int j = 0 ; j<b[i].Length ; j++)
			{
				c[ww][j]=b[i][j];
			}
			//Console.WriteLine("qewrwer");
		}
		Console.WriteLine("qwerqwerwqer");
		for (int i = 0 ; i<c.Length ; i++)
		{
			for (int j = 0 ; j<c[i].Length ; j++)
			{
				Console.Write(c[i][j]);
			}
			Console.Write(" ");
		}
		Console.WriteLine("qwer");
		for (int m = 1 ; m<=c.Length ; m++)
		{
			for (int i = 0 ; i< c[m-1].Length ; i++)
			{

				switch(c[m-1][i])
				{
					case 'A':
					sum+= 1*m;
					break;
					case 'B':
					sum+= 2*m;
					break;
					case 'C':
					sum+= 3*m;
					break;
					case 'D':
					sum+= 4*m;
					break;
					case 'E':
					sum+= 5*m;
					break;
					case 'F':
					sum+= 6*m;
					break;
					case 'G':
					sum+= 7*m;
					break;
					case 'H':
					sum+= 8*m;
					break;
					case 'I':
					sum+= 9*m;
					break;
					case 'J':
					sum+= 10*m;
					break;
					case 'K':
					sum+= 11*m;
					break;
					case 'L':
					sum+= 12*m;
					break;
					case 'M':
					sum+= 13*m;
					break;
					case 'N':
					sum+= 14*m;
					break;
					case 'O':
					sum+= 15*m;
					break;
					case 'P':
					sum+= 16*m;
					break;
					case 'Q':
					sum+= 17*m;
					break;
					case 'R':
					sum+= 18*m;
					break;
					case 'S':
					sum+= 19*m;
					break;
					case 'T':
					sum+= 20*m;
					break;
					case 'U':
					sum+= 21*m;
					break;
					case 'V':
					sum+= 22*m;
					break;
					case 'W':
					sum+= 23*m;
					break;
					case 'X':
					sum+= 24*m;
					break;
					case 'Y':
					sum+= 25*m;
					break;
					case 'Z':
					sum+= 26*m;
					break;
					default:
					break;
				}
				//Console.Write("qwer "+c[m-1][i]);
			}
		}
			Console.WriteLine(sum);
			//Console.WriteLine(m);
			
	}		
}