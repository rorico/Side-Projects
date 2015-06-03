using System;
using System.IO;

class dkafldjaf
{
	const string intensityFile = "words.txt"; 
	static void Main()
	{
		int cnt = 0;
		int[] x = new int[100];
		for (int i = 0 ; i<x.Length ; i++)
		{
			if (i==0)
			{
				x[i]=1;
			}else{
				x[i]=x[i-1]+i+1;
			}
			Console.WriteLine(x[i]);
		}
			
		
		int sum = 0;
		string s = "";
		using( StreamReader sr = new StreamReader(intensityFile))
		{
			s = sr.ReadLine();
		}
		string[] names = s.Split(',');
		for (int i = 0 ; i<names.Length ; i++)
		{
			names[i]=names[i].Trim('"');
		}
		
	
		int m = 1;
		for (int i = 0 ; i< names.Length ; i++)
		{
			sum = 0;
			char[] a=names[i].ToCharArray();
			for (int j = 0 ; j<a.Length ; j++)
			{
				//Console.Write(a[j]);
				switch(a[j])
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
			}
			for (int j = 0 ; j<x.Length ; j++)
			{
				if (sum==x[j])
				{
					cnt++;
					break;
				}
			}
			 
			//Console.Write("qwer "+c[m-1][i]);
		}
		Console.WriteLine(cnt);
			//Console.WriteLine(m);
			
	}		
}