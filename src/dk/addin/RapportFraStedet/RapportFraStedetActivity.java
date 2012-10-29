/*
  Copyright 2012, MapGuideForm user group, Frederikssund Kommune and Helsingør Kommune - att. Anette Poulsen and Erling Kristensen
  
  This file is part of "RapportFraStedet". 
  "RapportFraStedet" is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
  "RapportFraStedet" is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  You should have received a copy of the GNU General Public License along with "RapportFraStedet". If not, see <http://www.gnu.org/licenses/>.
*/

package dk.addin.RapportFraStedet;

import android.os.Bundle;
import com.changeit.wmpolyfill.CordovaWebClient;
import org.apache.cordova.*;

public class RapportFraStedetActivity extends DroidGap
{
	CordovaWebClient wmp;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
		wmp = new CordovaWebClient(this, appView);
		super.loadUrl("file:///android_asset/www/index.html");
    }
}
