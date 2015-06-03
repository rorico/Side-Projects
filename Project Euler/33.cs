using System;

class dkafldjaf
{
	static void Main()
	{
		for ( double i = 10 ; i< 100 ; i++)
		{
			string s = Convert.ToString(i);
			char[] a = s.ToCharArray();
			for ( double j = 10 ; j < 100 ; j++)
			{
				string r = Convert.ToString(j);
				char[] b = r.ToCharArray();
				//Console.WriteLine("{0} {1} {2}",j, b[0],b[1]);
				for ( int k = 0 ; k<=1 ; k++)
				{
					for ( int m = 0 ; m<=1 ; m++)
					{
						if (b[0]==b[1])
						{
							continue;
						}
						//Console.WriteLine("{0} {1}",a[1],b[1]);
						if ( b[1]==0||b[1]==a[1])
						{
							continue;
						}
						if (i>=j)
						{
						continue;
						}
						if ((double)((a[k]-'0'))/((b[m]-'0'))==i/j&&a[1-k]==b[1-m])
						{
							Console.WriteLine("{0}/{1} {2}/{3}",i,j,a[k],b[m]);
						}
					}
				}
			}
		}
		//Console.WriteLine(y);
	}		
}