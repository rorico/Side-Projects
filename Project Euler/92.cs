using System;

class dkafldjaf
{
	static void Main()
	{
		int x = 0;
		int y = 0;
		for ( int i = 1; i< 1e7 ; i++)
		{
			for ( int j = i ; j!=89&&j!=1 ; )
			{
				x=0;
				string s = Convert.ToString(j);
				char[] a = s.ToCharArray();
				for ( int k = 0 ; k < s.Length; k++)
				{
					x+=(a[k]-'0')*(a[k]-'0');
					//Console.WriteLine(x);
				}
				j=x;
			}
			if (x==89)
			{
				y++;
				Console.WriteLine(i);
			}
		}
		Console.WriteLine(y);
	}		
}