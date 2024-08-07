## Deployment Architecture 
```mermaid
C4Deployment
    title  
    
    Deployment_Node(teams, "Teams") {
        Container(Teams, "Teams", "", "")
    }

    Deployment_Node(github, "GitHub SPA host") {
        Container(React, "React with MSAL", "Single Page Application", "")
    }

    Deployment_Node(azure, "Azure / Entra ID") {
        Deployment_Node(organizationalResources, "Publishing Organization") {
            ContainerDb(Organizational_Resources, "Organizational Resources", "")
            
            Deployment_Node(publishingOrganization, "Local representation of registration") {
                Container(Service_Principal, "Service Principal", "", "")
                Container(Enterprise_Application, "Enterprise Application", "", "")        
            }
        }

        Deployment_Node(appRegistrations, "App Registrations") {
                    Container(helloworld_app, "helloworld-app", "Graph API permissions", "User.ReadWrite, Presence.ReadWrite")
        }
    }
    
    Rel(helloworld_app, Enterprise_Application, "Exposes as")
    Rel(React, Service_Principal, "Delegates to")
    Rel(Teams, React, "Provides endpoint with loginHint")
    BiRel(Service_Principal, Organizational_Resources, "Accesses")
    BiRel(React, Organizational_Resources, "On behalf of user")
    BiRel(Enterprise_Application, Service_Principal, "")

    UpdateElementStyle(azure, $borderColor="gray")
    UpdateElementStyle(github, $borderColor="gray")
    UpdateElementStyle(teams, $borderColor="gray")
    UpdateElementStyle(organizationalResources, $borderColor="gray")
    UpdateElementStyle(appRegistrations, $borderColor="gray")
    UpdateElementStyle(publishingOrganization, $borderColor="gray")
    
    UpdateRelStyle(helloworld_app, Enterprise_Application, $textColor="white", $lineColor="gray", ,$offsetX="5")
    UpdateRelStyle(React, Service_Principal, $textColor="white", $lineColor="gray", $offsetX="-40")
    UpdateRelStyle(Teams, React, $textColor="white", $lineColor="gray", $offsetY="-20", $offsetX="-90")
    UpdateRelStyle(Service_Principal, Organizational_Resources, $textColor="white", $lineColor="gray", $offsetY="-15", $offsetX="-40")
    UpdateRelStyle(React, Organizational_Resources, $textColor="white", $lineColor="gray", $offsetY="-15", $offsetX="-40")
    UpdateRelStyle(Enterprise_Application, Service_Principal, $textColor="white", $lineColor="gray")
```

## SSO auth flow 

```mermaid
flowchart TD
    subgraph Azure 
        A(App Registrations) 
    end 
    
    B[Teams]
    
    subgraph GitHub Pages
        C([React web app])
        D([MSAL])
    end 

    subgraph Publishing Organization 
        E(Organizational \nResources)
        F(Service \nPrincipal)
    end 

    G([user]) --> |email login hint|B

    A --- |A trust over Application ID URI|B
    A -. Sends Access Token at Runtime (SSO) .-> B
    B -. Provides endpoint with login hint .-> C
    C <--> D
    D <--> F
    E <--> F
    
    linkStyle 0,2,3,4,5,6 stroke-width:.3px;
```
## Publishing the application as Multi-tenant Application in other tenants  
```mermaid
flowchart TD
    subgraph App Owning Tenant 
        A(App Registrations) 

        subgraph Local representation of registration
            I(Service \nPrincipal)
        end 
        H(Organizational \nResources)
        B[Teams \npublished for Organization]
        G([user]) ----> |email login hint|B
    end
    
    subgraph GitHub Pages
        C([React web app])
        D([MSAL])
    end 

    subgraph App Borrowing Tenant
        L[Enterprise Application]
        
        subgraph Local representation of registration
            F(Service \nPrincipal)
        end 

        J[Teams \npublished for Organization]
        K([user]) ---> J
        E(Organizational \nResources)
    end 

    
    A --- |A trust over Application ID URI \nSends Access Token at Runtime via SSO|B
    B --> |Provides endpoint with login hint|C
    C <--> D
    D --> F
    F <--> E
    D --> I
    J --> |Provides endpoint with login hint|C
    A --- |Exposes as multi-tenant app|L
    L --- |A trust over Application ID URI \nSends Access Token at Runtime via SSO|J
    I <--> H

    linkStyle 0,1,3,4,5,6,7,8,11 stroke-width:.3px;
```

<details>
  <summary>on Teams with SSO 👀</summary>
  <img src="https://github.com/user-attachments/assets/0a4db79b-b849-413f-a625-289d5a947d15"></img>
</details>

<details>
  <summary>on web browser with login popup 👀</summary>
  <img src="https://github.com/user-attachments/assets/9a0ddffe-efc8-4b06-a98d-6918b2798f80"></img>
  <img src="https://github.com/user-attachments/assets/6e051be3-d3bd-4259-8493-e2bdabf28f96"></img>
</details>
