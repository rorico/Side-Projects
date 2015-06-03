using System;

class dkafldjaf
{
	static void Main()
	{
		for (int i = 1 ; ; i++)
		{
			string s = Convert.ToString(i);
			char[] a = s.ToCharArray();
			Array.Sort(a);
			for (int j = 1 ; j<=6 ; j++)
			{
				string k = Convert.ToString(i*j);
				if (k.Length!=s.Length)
				{
					break;
				}
				char[] b = k.ToCharArray();
				Array.Sort(b);
				int index = 0;
				for( int m = 0 ; m<a.Length ; m++)
				{
					if (a[m]!=b[m])
					{
						index++;
						break;
					}
				}
				if (index!=0)
				{
					break;
				}
				if (j==6)
				{
					Console.WriteLine(i);
				}
			}
		}
	}
}