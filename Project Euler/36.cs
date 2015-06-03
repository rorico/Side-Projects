using System;

class dkafldjaf
{
	static void Main()
	{
		int a = 0;
		int rew = 0;
		string s;
		string b;
		string bb;
		string z="";
		double plo = 0;
		for ( int y = 1 ; y<1e6 ; y ++)
		{
			s = Convert.ToString(y);
			char[] ab = s.ToCharArray();
			Array.Reverse(ab);
			b = new string(ab);
			int i = int.Parse(s);
			int j = int.Parse(b);
			if(i==j)
			{
				z="";
				double re = (double) i;
				plo = (int)(Math.Log(re)/Math.Log(2));
				Console.WriteLine("{0} {1}",plo,y);
				for( int k = (int)plo; k >= 0 ; k--)
				{
					double ya = re/(Math.Pow(2,k));
					z += Convert.ToString((int) ya);			
					re =  re % Math.Pow(2,k);
				}
				Console.WriteLine(z);
				char[] bab = z.ToCharArray();
				Array.Reverse(bab);
				bb = new string(bab);
				//int bi = int.Parse(z);
				//int bj = int.Parse(bb);
				if (z==bb)
				{
					rew+=i;
					Console.WriteLine(z);
				}
						
				
			}

		}
		Console.WriteLine(rew);
	
	}		
}