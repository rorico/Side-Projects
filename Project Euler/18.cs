using System;

class dkafldjaf
{
	static void Main()
	{
		string s = "75 95 64 17 47 82 18 35 87 10 20 04 82 47 65 19 01 23 75 03 34 88 02 77 73 07 63 67 99 65 04 28 06 16 70 92 41 41 26 56 83 40 80 70 33 41 48 72 33 47 32 37 16 94 29 53 71 44 65 25 43 91 52 97 51 14 70 11 33 28 77 73 17 78 39 68 17 57 91 71 52 38 17 14 91 43 58 50 27 29 48 63 66 04 68 89 53 67 30 73 16 69 87 40 31 04 62 98 27 23 09 70 98 73 93 38 53 60 04 23";
		char[] a = s.ToCharArray();
		int[][] x = new int[15][];
		for (int i = 0; i<15; i++)
		{
			x[i]=new int[i+1];
		}
		int w = 0;
		for (int i = 0; i<15 ; i++)
		{

			for (int j = 0 ; j<=i; j++)
			{
				int fds=3*w;
				int sdf=3*w+1;
				int y = (int)char.GetNumericValue(a[fds]);
				int asd = 10*y;
				int dsa = (int)char.GetNumericValue(a[sdf]);
				x[i][j]=asd+dsa;
				//Console.Write("{0,2} ",x[i][j]);
				w++;
			}
			//Console.WriteLine();
		}
		int end = xx(15,0,x);
		Console.WriteLine(end);
	}
	static int xx (int x, int y, int[][] a)
	{
		x--;
		if (x==0)
		{
			return a[14][y];
		}
		if (x<0)
		{
			return 0;
		}
		int max = 0;
		int b = a[14-x][y];
		for (int i = 0 ; i<2 ; i++)
		{
			y+=i;
			int z = xx(x, y, a);
			if (z>max)
			{
				max=z;
			}
		}
		max+=b;
		return max;
	}
}