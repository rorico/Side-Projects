using System;
using System.IO;
using System.Collections.Generic;

class dkafldjaf
{	
	static int line = 0;
	static void Main()
	{
		Dictionary<char,int> values = new Dictionary<char,int>();
		char[] p = {'0','1','2','3','4','5','6','7','8','9','T','J','Q','K','A'};
		for(int i = 0 ; i < p.Length ; i++)
		{
			values.Add(p[i],i);
		}
		int cnt1 = 0;
		string[][] x = new string[1000][];
		int cnt = 0;
		StreamReader sr = new StreamReader("poker.txt");
		while(!sr.EndOfStream)
		{
			string line = sr.ReadLine( );
			x[cnt] = line.Split(' ');
			cnt++;
		}
		sr.Close();
		foreach ( string[] a in x )
		{
			line++;
			int[] p1n = new int[5];
			char[] p1s = new char[5];
			int[] p2n = new int[5];
			char[] p2s = new char[5];
			for ( int i = 0 ; i<5 ; i++)
			{
				p1n[i] = values[a[i][0]];
				p1s[i] = a[i][1];
			}
			Array.Sort(p1n);
			for ( int i = 0 ; i<5 ; i++)
			{

				p2n[i] = values[a[i+5][0]];
				p2s[i] = a[i+5][1];
			}
			Array.Sort(p2n);

			if(compare(p1n,p1s,p2n,p2s)){
				//Console.WriteLine(line);
				cnt1++;
			}
			//Console.Write(a[0] + " " + a[1]);
			/*
			if ( SF(p1)==1&&SF(p2)!=1)
			{
			Console.WriteLine("qwer");
				cnt1++;
				break;
			} else if ( SF(p1)==1&&SF(p2)==1&&compare(p1,p2)) {
				cnt1++;
				break;
			}*/
			//Console.WriteLine("qweeqwrqwr");
				
		}
		Console.WriteLine(cnt1);
	}
	static int RF( int[] pn, char[] ps )	//royal flush
	{
		if (!(ps[0]==ps[1]&&ps[1]==ps[2]&&ps[2]==ps[3]&&ps[3]==ps[4])){ //same suit
			return -1;
		}
		for ( int i = 0 ; i<5 ; i++)
		{
			if (pn[i] != i + 10)
			{
				return -1;
			}
		}
		return 15;
	}
	static int SF( int[] pn, char[] ps )
	{
		if ( ps[0]==ps[1]&&ps[1]==ps[2]&&ps[2]==ps[3]&&ps[3]==ps[4])
		{
			int lowest = pn[0];
			for ( int i = 1 ; i<5 ; i++)
			{
				if (pn[i] != lowest + i)
				{
					return -1;
				}
			}
			return pn[4];
		} else{
			return -1;
		}
	}
	static int FoaK( int[] pn, char[] ps )
	{
		int start = pn[0];
		int cnt = 1;
		for ( int i = 1 ; i<5 ; i++)
		{
			if (pn[i] == start)
			{
				cnt++;
			} else {
				start = pn[i];
				cnt = 1;
			}
			if(cnt == 4){
				return pn[i];
			}
		}
		return -1;
	}

	static int FH( int[] pn, char[] ps )
	{
		int start = pn[0];
		int cnt = 1;
		bool next = false;
		int tripleCard = -1;
		for ( int i = 1 ; i<5 ; i++)
		{
			if (pn[i] == start)
			{
				cnt++;
			} else {
				if (next){
					return -1;
				} else {
					if(cnt == 3){
						tripleCard = pn[i-1];
					}
					start = pn[i];
					cnt = 1;
					next = true;
				}
			}
		}
		if(tripleCard==-1){
			tripleCard = pn[4];
		}
		return tripleCard;
	}
	static int F( int[] pn, char[] ps )	
	{
		if (ps[0]==ps[1]&&ps[1]==ps[2]&&ps[2]==ps[3]&&ps[3]==ps[4]){ //same suit
			return pn[4];
		} else {
			return -1;
		}
	}

	static int sS( int[] pn, char[] ps )
	{
		int lowest = pn[0];
		for ( int i = 1 ; i<4 ; i++)
		{
			if (pn[i] != lowest + i)
			{
				return -1;
			}
		}
		if(pn[4]==14&& pn[0] == 2){
			Console.WriteLine("test" + line);
			return pn[3];
		} else {
			return -1;
		}
	}

	static int S( int[] pn, char[] ps )
	{
		int lowest = pn[0];
		for ( int i = 1 ; i<5 ; i++)
		{
			if (pn[i] != lowest + i)
			{
				return -1;
			}
		}
		return pn[4];
	}

	static int ToaK( int[] pn, char[] ps )
	{
		int start = pn[0];
		int cnt = 1;
		for ( int i = 1 ; i<5 ; i++)
		{
			if (pn[i] == start)
			{
				cnt++;
			} else {
				start = pn[i];
				cnt = 1;
			}
			if(cnt == 3){
				return pn[i];
			}
		}
		return -1;
	}
	static int[] TP( int[] pn, char[] ps )
	{
		int[] ret = new int[3];
		ret[2] = -1;
		int start = pn[0];
		int cnt = 1;
		bool next = false;
		bool check = false;
		for ( int i = 1 ; i<5 ; i++)
		{
			if (pn[i] == start)
			{
				cnt++;
			} else {
				if (next){
					if(cnt == 2){
						ret[0] = pn[i-1];
						check = true;
					} else {
						ret[2] = pn[i-1];
					}
				} else {
					if(cnt == 2){
						ret[1] = pn[i-1];
						next = true;
					} else {
						ret[2] = pn[i-1];
					}
				}
				start = pn[i];
				cnt = 1;
			}
		}
		if(cnt == 1){
			ret[2] = pn[4];
		}
		if(cnt==2 && next){
			ret[0] = pn[4];
		} else if(!check) {
			ret[0] = -1;
		}
		return ret;
	}

	static int P( int[] pn, char[] ps )
	{
		int start = pn[0];
		int cnt = 1;
		for ( int i = 1 ; i<5 ; i++)
		{
			if (pn[i] == start)
			{
				cnt++;
			} else {
				start = pn[i];
				cnt = 1;
			}
			if(cnt == 2){
				return pn[i];
			}
		}
		return -1;
	}
	static bool compare( int[] p1n, char[] p1s, int[] p2n, char[] p2s )
	{
		sS(p1n,p1s);
		sS(p2n,p2s);

		int p1 = RF(p1n,p1s);
		int p2 = RF(p2n,p2s);
		if(p1>p2){
			return true;
		} else if(p1<p2){
			return false;
		}

		p1 = SF(p1n,p1s);
		p2 = SF(p2n,p2s);
		if(p1>p2){
			return true;
		} else if(p1<p2){
			return false;
		}

		p1 = FoaK(p1n,p1s);
		p2 = FoaK(p2n,p2s);
		if(p1>p2){
			return true;
		} else if(p1<p2){
			return false;
		} 



		p1 = FH(p1n,p1s);
		p2 = FH(p2n,p2s);
		if(p1>p2){
			return true;
		} else if(p1<p2){
			return false;
		} else if(p1!=-1&&p2!=-1){
			for(int i = 4 ; i>=0 ; i--){
				if(p1n[i]>p2n[i]){
					return true;
				} else if(p1n[i]<p2n[i]){
					return false;
				}
			}
		}

		p1 = F(p1n,p1s);
		p2 = F(p2n,p2s);
		if(p1>p2){
			return true;
		} else if(p1<p2){
			return false;
		} else if(p1!=-1&&p2!=-1){
			for(int i = 4 ; i>=0 ; i--){
				if(p1n[i]>p2n[i]){
					return true;
				} else if(p1n[i]<p2n[i]){
					return false;
				}
			}
		}

		p1 = S(p1n,p1s);
		p2 = S(p2n,p2s);
		if(p1>p2){
			return true;
		} else if(p1<p2){
			return false;
		} 


		p1 = ToaK(p1n,p1s);
		p2 = ToaK(p2n,p2s);
		if(p1>p2){
			return true;
		} else if(p1<p2){
			return false;
		} else if(p1!=-1&&p2!=-1){
			for(int i = 4 ; i>=0 ; i--){
				if(p1n[i]>p2n[i]){
					return true;
				} else if(p1n[i]<p2n[i]){
					return false;
				}
			}
		}

		int[] p1t = TP(p1n,p1s);
		int[] p2t = TP(p2n,p2s);
		if(p1t[0]>p2t[0]){
			return true;
		} else if(p1t[0]<p2t[0]){
			return false;
		} else if(p1t[0]!=-1&&p2t[0]!=-1){
			for(int i = 0 ; i<2 ; i++){
				if(p1t[i]>p2t[i]){
					return true;
				} else if(p1t[i]<p2t[i]){
					return false;
				}
			}
		}

		p1 = P(p1n,p1s);
		p2 = P(p2n,p2s);
		if(p1>p2){
			return true;
		} else if(p1<p2){
			return false;
		} else if(p1!=-1&&p2!=-1){
			for(int i = 4 ; i>=0 ; i--){
				if(p1n[i]>p2n[i]){
					return true;
				} else if(p1n[i]<p2n[i]){
					return false;
				}
			}
		}

		for(int i = 4 ; i>=0 ; i--){
			if(p1n[i]>p2n[i]){
				return true;
			} else if(p1n[i]<p2n[i]){
				return false;
			}
		}


		return false;
	}
	static int highest ( string[] p1 )
	{
		for ( int i = 0 ; i <5 ; i++)
		{
			if (p1[i][0] == 'A')
			{
				return 14;
			}
		}
		for ( int i = 0 ; i <5 ; i++)
		{
			if (p1[i][0] == 'K')
			{
				return 13;
			}
		}
		for ( int i = 0 ; i <5 ; i++)
		{
			if (p1[i][0] == 'Q')
			{
				return 12;
			}
		}
		for ( int i = 0 ; i <5 ; i++)
		{
			if (p1[i][0] == 'J')
			{
				return 11;
			}
		}
		for ( int i = 0 ; i <5 ; i++)
		{
			if (p1[i][0] == 'T')
			{
				return 10;
			}
		}
		Array.Sort(p1);
		return (int) Char.GetNumericValue(p1[4][0]);
	}
}